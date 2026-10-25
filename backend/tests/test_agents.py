import pytest
from app.agents.planner import PlannerAgent
from app.agents.reviewer import ReviewerAgent
from app.agents.analysis import AnalysisAgent

@pytest.mark.asyncio
async def test_planner_agent_output():
    planner = PlannerAgent()
    out = await planner.run({"objective": "Analyze top EV startups in India"})
    assert out.success is True
    assert out.agent_role == "planner"
    assert "tasks" in out.data
    assert len(out.data["tasks"]) >= 3

@pytest.mark.asyncio
async def test_reviewer_agent_checks():
    reviewer = ReviewerAgent()
    out = await reviewer.run({
        "objective": "Test objective",
        "research_data": {"citations": [{"title": "Source 1", "url": "https://example.com"}]},
        "analysis_data": {"synthesis": [{"topic": "Topic 1", "content": "Analysis content"}]}
    })
    assert out.success is True
    assert out.data["all_passed"] is True
    assert out.data["score"] > 80
