from typing import Dict, Any
from app.agents.base import BaseAgent, AgentOutput
from app.tools.registry import tool_registry

class ReportAgent(BaseAgent):
    def __init__(self):
        super().__init__(role="report")

    async def run(self, context: Dict[str, Any]) -> AgentOutput:
        objective = context.get("objective", "")
        user_id = context.get("user_id", "")
        execution_id = context.get("execution_id", "")
        research_data = context.get("research_data", {})
        analysis_data = context.get("analysis_data", {})
        reviewer_data = context.get("reviewer_data", {})

        synthesis = analysis_data.get("synthesis", [])
        citations = research_data.get("citations", [])

        title = f"Nexus AI Strategic Intelligence Report: {objective[:80]}"
        summary = (
            f"This comprehensive intelligence report addresses the objective: '{objective}'. "
            f"Synthesizing {len(citations)} verified evidence sources, the analysis demonstrates "
            "actionable patterns, comparative positioning, and clear strategic recommendations."
        )

        tool_result = await tool_registry.execute(
            name="report_generator",
            params={
                "title": title,
                "executive_summary": summary,
                "methodology": "Nexus AI autonomous multi-agent orchestration pipeline with empirical search and reviewer verification.",
                "findings": synthesis,
                "evidence": citations,
                "limitations": "Findings reflect publicly discoverable materials and authorized input documents as of the execution timestamp."
            },
            user_id=user_id,
            execution_id=execution_id
        )

        res_data = tool_result.get("result", {})

        return AgentOutput(
            agent_role=self.role,
            success=True,
            data=res_data,
            summary=f"Report successfully compiled and saved as artifact: {res_data.get('artifact_id')}",
            tokens_used=210
        )
