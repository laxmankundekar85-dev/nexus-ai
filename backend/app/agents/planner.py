from typing import Dict, Any, List
from app.agents.base import BaseAgent, AgentOutput
from app.core.config import settings

class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(role="planner")

    async def run(self, context: Dict[str, Any]) -> AgentOutput:
        objective = context.get("objective", "")
        document_ids = context.get("document_ids", [])

        # Subtasks generation based on objective
        tasks = [
            {
                "task_index": 1,
                "agent_role": "research",
                "description": f"Gather factual data and industry references for: {objective}",
                "dependencies": [],
                "expected_output": "Key facts, entity details, market references, and citations."
            }
        ]

        if document_ids:
            tasks.append({
                "task_index": 2,
                "agent_role": "document",
                "description": "Extract relevant passages and contextual evidence from attached documents.",
                "dependencies": [],
                "expected_output": "Grounding passages and document page citations."
            })

        tasks.append({
            "task_index": len(tasks) + 1,
            "agent_role": "analysis",
            "description": "Synthesize gathered research and data into comparative metrics and patterns.",
            "dependencies": [1],
            "expected_output": "Structured analysis, comparative evaluation, and metrics breakdown."
        })

        tasks.append({
            "task_index": len(tasks) + 1,
            "agent_role": "reviewer",
            "description": "Review findings for factual consistency, citation verification, and completeness.",
            "dependencies": [len(tasks)],
            "expected_output": "Validation scorecard, flagged assumptions, and quality confirmation."
        })

        tasks.append({
            "task_index": len(tasks) + 1,
            "agent_role": "report",
            "description": "Produce final executive markdown report with structured citations and download artifact.",
            "dependencies": [len(tasks)],
            "expected_output": "Final versioned markdown report artifact."
        })

        plan_data = {
            "objective": objective,
            "strategy": "Sequential multi-agent verification pipeline with grounding and quality checks.",
            "total_tasks": len(tasks),
            "tasks": tasks
        }

        return AgentOutput(
            agent_role=self.role,
            success=True,
            data=plan_data,
            summary=f"Plan generated with {len(tasks)} structured tasks and role handoffs.",
            tokens_used=120
        )
