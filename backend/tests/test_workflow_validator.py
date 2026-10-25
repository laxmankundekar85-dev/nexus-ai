from app.workflows.validator import validate_workflow_graph

def test_valid_workflow_graph():
    graph = {
        "nodes": [
            {"id": "node-1", "type": "start", "position": {"x": 0, "y": 0}},
            {"id": "node-2", "type": "planner", "position": {"x": 100, "y": 0}},
            {"id": "node-3", "type": "research", "position": {"x": 200, "y": 0}},
            {"id": "node-4", "type": "end", "position": {"x": 300, "y": 0}}
        ],
        "edges": [
            {"id": "e1", "source": "node-1", "target": "node-2"},
            {"id": "e2", "source": "node-2", "target": "node-3"},
            {"id": "e3", "source": "node-3", "target": "node-4"}
        ]
    }
    res = validate_workflow_graph(graph)
    assert res.valid is True
    assert len(res.errors) == 0

def test_missing_start_node():
    graph = {
        "nodes": [
            {"id": "node-2", "type": "planner", "position": {"x": 100, "y": 0}},
            {"id": "node-4", "type": "end", "position": {"x": 300, "y": 0}}
        ],
        "edges": [
            {"id": "e1", "source": "node-2", "target": "node-4"}
        ]
    }
    res = validate_workflow_graph(graph)
    assert res.valid is False
    assert any("Start" in err for err in res.errors)

def test_cycle_detection():
    graph = {
        "nodes": [
            {"id": "node-1", "type": "start", "position": {"x": 0, "y": 0}},
            {"id": "node-2", "type": "planner", "position": {"x": 100, "y": 0}},
            {"id": "node-3", "type": "research", "position": {"x": 200, "y": 0}},
            {"id": "node-4", "type": "end", "position": {"x": 300, "y": 0}}
        ],
        "edges": [
            {"id": "e1", "source": "node-1", "target": "node-2"},
            {"id": "e2", "source": "node-2", "target": "node-3"},
            {"id": "e3", "source": "node-3", "target": "node-2"}, # cycle!
            {"id": "e4", "source": "node-3", "target": "node-4"}
        ]
    }
    res = validate_workflow_graph(graph)
    assert res.valid is False
    assert any("cycle" in err.lower() for err in res.errors)
