from typing import Dict, Any
from app.agents.base import BaseAgent, AgentOutput
from app.tools.registry import tool_registry

class DocumentAgent(BaseAgent):
    def __init__(self):
        super().__init__(role="document")

    async def run(self, context: Dict[str, Any]) -> AgentOutput:
        objective = context.get("objective", "")
        document_ids = context.get("document_ids", [])
        user_id = context.get("user_id", "")
        execution_id = context.get("execution_id", "")

        tool_result = await tool_registry.execute(
            name="document_retrieval",
            params={
                "query": objective,
                "document_ids": document_ids,
                "max_passages": 5
            },
            user_id=user_id,
            execution_id=execution_id
        )

        res_data = tool_result.get("result", {})
        passages = res_data.get("passages", [])

        output_data = {
            "passages": passages,
            "passages_count": len(passages),
            "grounding_status": "grounded" if passages else "no_matches_found"
        }

        return AgentOutput(
            agent_role=self.role,
            success=True,
            data=output_data,
            summary=f"Retrieved {len(passages)} grounded passages from uploaded user documents.",
            tokens_used=180
        )
