from app.tools.registry import tool_registry
from app.tools.web_search import web_search_tool
from app.tools.document_retrieval import document_retrieval_tool
from app.tools.data_analysis import data_analysis_tool
from app.tools.report_generator import report_generator_tool

# Register all built-in tools
tool_registry.register(
    name="web_search",
    description="Search external web sources for current factual information.",
    func=web_search_tool,
    required_permissions=["web:search"]
)

tool_registry.register(
    name="document_retrieval",
    description="Retrieve relevant passages from user uploaded documents.",
    func=document_retrieval_tool,
    required_permissions=["docs:read"]
)

tool_registry.register(
    name="data_analysis",
    description="Perform deterministic mathematical, statistical, and pattern calculations.",
    func=data_analysis_tool,
    required_permissions=["data:analyze"]
)

tool_registry.register(
    name="report_generator",
    description="Generate structured Markdown report artifacts with verified citations.",
    func=report_generator_tool,
    required_permissions=["reports:write"]
)

__all__ = ["tool_registry"]
