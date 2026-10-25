from typing import Dict, Any, List
from app.workflows.validator import validate_workflow_graph
from app.agents.orchestrator import orchestrator

async def execute_custom_workflow(workflow_definition: Dict[str, Any], execution_id: str, user_id: str):
    """Validate and execute a custom workflow graph."""
    validation = validate_workflow_graph(workflow_definition)
    if not validation.valid:
        await orchestrator._fail_execution(
            execution_id,
            f"Invalid workflow graph: {'; '.join(validation.errors)}"
        )
        return

    # Run execution with the orchestrator pipeline
    await orchestrator.run_execution(execution_id, user_id)
