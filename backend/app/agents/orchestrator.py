import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy import select, update
import app.core.database as db
from app.core.redis_client import redis_manager
from app.models.execution import Execution, ExecutionEvent
from app.models.task import Task
from app.models.approval import ApprovalRequest
from app.agents.planner import PlannerAgent
from app.agents.research import ResearchAgent
from app.agents.document import DocumentAgent
from app.agents.analysis import AnalysisAgent
from app.agents.reviewer import ReviewerAgent
from app.agents.report import ReportAgent

class AgentOrchestrator:
    def __init__(self):
        self.planner = PlannerAgent()
        self.research_agent = ResearchAgent()
        self.document_agent = DocumentAgent()
        self.analysis_agent = AnalysisAgent()
        self.reviewer_agent = ReviewerAgent()
        self.report_agent = ReportAgent()

    async def emit_event(self, execution_id: str, event_type: str, safe_metadata: Dict[str, Any], task_id: Optional[str] = None):
        """Persist execution event to DB and stream via SSE."""
        now = datetime.now(timezone.utc)
        event_id = str(uuid.uuid4())
        event_dict = {
            "id": event_id,
            "execution_id": execution_id,
            "task_id": task_id,
            "event_type": event_type,
            "safe_metadata": safe_metadata,
            "created_at": now.isoformat()
        }

        # Save to DB
        async with db.AsyncSessionLocal() as session:
            ev = ExecutionEvent(
                id=event_id,
                execution_id=execution_id,
                task_id=task_id,
                event_type=event_type,
                safe_metadata=safe_metadata,
                created_at=now
            )
            session.add(ev)
            await session.commit()

        # Publish for real-time SSE subscribers
        await redis_manager.publish_event(f"execution:{execution_id}", event_dict)

    async def check_cancellation(self, execution_id: str) -> bool:
        async with db.AsyncSessionLocal() as session:
            res = await session.execute(select(Execution.status).where(Execution.id == execution_id))
            status = res.scalar_one_or_none()
            return status == "cancelled"

    async def run_execution(self, execution_id: str, user_id: str):
        """Main execution lifecycle runner."""
        # 1. Initialize and set status to planning
        async with db.AsyncSessionLocal() as session:
            exec_res = await session.execute(select(Execution).where(Execution.id == execution_id))
            execution = exec_res.scalar_one_or_none()
            if not execution:
                return

            objective = execution.objective
            execution.status = "planning"
            execution.started_at = datetime.now(timezone.utc)
            await session.commit()

        await self.emit_event(execution_id, "status_changed", {"status": "planning", "message": "Planning tasks and dependencies"})

        context = {
            "execution_id": execution_id,
            "user_id": user_id,
            "objective": objective
        }

        # 2. Planner Agent
        try:
            plan_out = await self.planner.run(context)
            plan_data = plan_out.data

            async with db.AsyncSessionLocal() as session:
                await session.execute(
                    update(Execution)
                    .where(Execution.id == execution_id)
                    .values(plan=plan_data, status="running")
                )

                # Persist tasks from plan into database
                db_tasks = []
                for t in plan_data.get("tasks", []):
                    task_id = str(uuid.uuid4())
                    t["db_id"] = task_id
                    dbt = Task(
                        id=task_id,
                        execution_id=execution_id,
                        agent_role=t.get("agent_role"),
                        description=t.get("description"),
                        status="pending",
                        input_data={"dependencies": t.get("dependencies")},
                        dependency_data={"expected_output": t.get("expected_output")}
                    )
                    db_tasks.append(dbt)
                    session.add(dbt)
                await session.commit()

            await self.emit_event(execution_id, "plan_created", {"plan": plan_data})
            await self.emit_event(execution_id, "status_changed", {"status": "running", "message": "Executing agent tasks"})

        except Exception as e:
            await self._fail_execution(execution_id, f"Planning failed: {str(e)}")
            return

        # 3. Execute Subtasks
        research_out_data = {}
        document_out_data = {}
        analysis_out_data = {}

        for t in plan_data.get("tasks", []):
            if await self.check_cancellation(execution_id):
                await self.emit_event(execution_id, "execution_cancelled", {"message": "Execution cancelled by user"})
                return

            task_id = t.get("db_id")
            role = t.get("agent_role")

            # Update task to running
            async with db.AsyncSessionLocal() as session:
                await session.execute(
                    update(Task)
                    .where(Task.id == task_id)
                    .values(status="running", started_at=datetime.now(timezone.utc))
                )
                await session.commit()

            await self.emit_event(execution_id, "task_started", {"task_id": task_id, "agent_role": role, "description": t.get("description")}, task_id=task_id)

            try:
                if role == "research":
                    out = await self.research_agent.run(context)
                    research_out_data = out.data
                    context["research_data"] = research_out_data

                elif role == "document":
                    out = await self.document_agent.run(context)
                    document_out_data = out.data
                    context["document_data"] = document_out_data

                elif role == "analysis":
                    out = await self.analysis_agent.run(context)
                    analysis_out_data = out.data
                    context["analysis_data"] = analysis_out_data

                elif role == "reviewer":
                    # Transition execution status to reviewing
                    async with db.AsyncSessionLocal() as session:
                        await session.execute(update(Execution).where(Execution.id == execution_id).values(status="reviewing"))
                        await session.commit()
                    await self.emit_event(execution_id, "status_changed", {"status": "reviewing", "message": "Reviewing evidence and factual claims"})

                    out = await self.reviewer_agent.run(context)
                    context["reviewer_data"] = out.data

                elif role == "report":
                    out = await self.report_agent.run(context)
                    context["report_data"] = out.data

                else:
                    out = AgentOutput(agent_role=role, success=True, data={}, summary="Task completed.")

                # Mark task completed
                async with db.AsyncSessionLocal() as session:
                    await session.execute(
                        update(Task)
                        .where(Task.id == task_id)
                        .values(
                            status="completed",
                            output_data=out.data,
                            completed_at=datetime.now(timezone.utc)
                        )
                    )
                    await session.commit()

                await self.emit_event(
                    execution_id,
                    "task_completed",
                    {"task_id": task_id, "agent_role": role, "summary": out.summary},
                    task_id=task_id
                )

            except Exception as e:
                async with db.AsyncSessionLocal() as session:
                    await session.execute(
                        update(Task)
                        .where(Task.id == task_id)
                        .values(
                            status="failed",
                            error_summary=str(e),
                            completed_at=datetime.now(timezone.utc)
                        )
                    )
                    await session.commit()

                await self.emit_event(execution_id, "task_failed", {"task_id": task_id, "error": str(e)}, task_id=task_id)
                await self._fail_execution(execution_id, f"Task {role} failed: {str(e)}")
                return

        # 4. Finalize execution
        async with db.AsyncSessionLocal() as session:
            await session.execute(
                update(Execution)
                .where(Execution.id == execution_id)
                .values(
                    status="completed",
                    completed_at=datetime.now(timezone.utc)
                )
            )
            await session.commit()

        await self.emit_event(
            execution_id,
            "status_changed",
            {
                "status": "completed",
                "message": "All tasks completed successfully. Final report generated.",
                "artifact_id": context.get("report_data", {}).get("artifact_id")
            }
        )

    async def _fail_execution(self, execution_id: str, error_msg: str):
        async with db.AsyncSessionLocal() as session:
            await session.execute(
                update(Execution)
                .where(Execution.id == execution_id)
                .values(
                    status="failed",
                    error_summary=error_msg,
                    completed_at=datetime.now(timezone.utc)
                )
            )
            await session.commit()

        await self.emit_event(execution_id, "status_changed", {"status": "failed", "error": error_msg})

orchestrator = AgentOrchestrator()
