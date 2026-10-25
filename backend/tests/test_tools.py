import pytest
from app.tools.registry import tool_registry
import app.tools  # Trigger registrations

@pytest.mark.asyncio
async def test_tool_registry_execution():
    tools = tool_registry.list_tools()
    tool_names = [t["name"] for t in tools]
    assert "web_search" in tool_names
    assert "data_analysis" in tool_names

@pytest.mark.asyncio
async def test_data_analysis_calculation():
    res = await tool_registry.execute(
        name="data_analysis",
        params={
            "data": [
                {"name": "A", "val": 10},
                {"name": "B", "val": 20},
                {"name": "C", "val": 30}
            ],
            "operation": "summary"
        },
        user_id="user-1",
        execution_id="exec-1"
    )
    assert res["success"] is True
    metrics = res["result"]["analysis"]["metrics"]["val"]
    assert metrics["count"] == 3
    assert metrics["mean"] == 20.0
    assert metrics["sum"] == 60.0
