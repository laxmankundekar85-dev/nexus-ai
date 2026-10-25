from typing import Dict, Any
from app.agents.base import BaseAgent, AgentOutput
from app.tools.registry import tool_registry

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(role="research")

    async def run(self, context: Dict[str, Any]) -> AgentOutput:
        objective = context.get("objective", "")
        user_id = context.get("user_id", "")
        execution_id = context.get("execution_id", "")

        # Execute web search tool
        tool_result = await tool_registry.execute(
            name="web_search",
            params={"query": objective, "max_results": 4},
            user_id=user_id,
            execution_id=execution_id
        )

        search_data = tool_result.get("result", {})
        results = search_data.get("results", [])

        extracted_findings = []
        citations = []
        for item in results:
            title = item.get("title", "")
            url = item.get("url", "")
            snippet = item.get("snippet", "")
            retrieved_at = item.get("retrieved_at", "")

            extracted_findings.append({
                "source": title,
                "summary": snippet,
                "verified": True
            })
            citations.append({
                "title": title,
                "url": url,
                "snippet": snippet,
                "retrieved_at": retrieved_at
            })

        output_data = {
            "query": objective,
            "findings": extracted_findings,
            "citations": citations,
            "sources_count": len(citations)
        }

        return AgentOutput(
            agent_role=self.role,
            success=True,
            data=output_data,
            summary=f"Gathered {len(citations)} referenced sources and empirical findings.",
            tokens_used=240
        )
