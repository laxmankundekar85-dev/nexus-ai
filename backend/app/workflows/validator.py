from typing import Dict, Any, List, Set
from collections import defaultdict, deque
from app.schemas.workflow import ValidationResult

VALID_NODE_TYPES = {
    "start",
    "planner",
    "research",
    "document",
    "analysis",
    "reviewer",
    "report",
    "approval",
    "end"
}

def validate_workflow_graph(workflow_definition: Dict[str, Any]) -> ValidationResult:
    errors: List[str] = []
    warnings: List[str] = []

    nodes = workflow_definition.get("nodes", [])
    edges = workflow_definition.get("edges", [])

    if not nodes:
        return ValidationResult(valid=False, errors=["Workflow contains no nodes."], warnings=[])

    node_ids: Set[str] = set()
    node_types: Dict[str, str] = {}
    start_nodes: List[str] = []
    end_nodes: List[str] = []

    for node in nodes:
        nid = node.get("id")
        ntype = str(node.get("type", "")).lower()

        if not nid:
            errors.append("Found node without an 'id'.")
            continue

        if nid in node_ids:
            errors.append(f"Duplicate node ID detected: '{nid}'.")
        node_ids.add(nid)
        node_types[nid] = ntype

        if ntype not in VALID_NODE_TYPES:
            errors.append(f"Node '{nid}' has unsupported type '{ntype}'. Permitted: {sorted(list(VALID_NODE_TYPES))}")

        if ntype == "start":
            start_nodes.append(nid)
        elif ntype == "end":
            end_nodes.append(nid)

    # Must have exactly 1 Start node
    if len(start_nodes) == 0:
        errors.append("Workflow must contain a 'Start' node.")
    elif len(start_nodes) > 1:
        warnings.append(f"Multiple Start nodes detected ({len(start_nodes)}). First one will be used.")

    # Must have at least 1 End node
    if len(end_nodes) == 0:
        errors.append("Workflow must contain at least one 'End' node.")

    # Validate edges
    adj: Dict[str, List[str]] = defaultdict(list)
    in_degree: Dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source not in node_ids:
            errors.append(f"Edge references non-existent source node '{source}'.")
        if target not in node_ids:
            errors.append(f"Edge references non-existent target node '{target}'.")

        if source in node_ids and target in node_ids:
            adj[source].append(target)
            in_degree[target] = in_degree.get(target, 0) + 1

    # Cycle detection via Kahn's algorithm
    q = deque([nid for nid in node_ids if in_degree[nid] == 0])
    visited_count = 0
    while q:
        curr = q.popleft()
        visited_count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                q.append(neighbor)

    if visited_count < len(node_ids):
        errors.append("Workflow graph contains an unsupported cycle. Directed Acyclic Graphs (DAG) required.")

    # Check path from start to end
    if start_nodes and end_nodes and not errors:
        visited = set()
        stack = [start_nodes[0]]
        while stack:
            curr = stack.pop()
            if curr not in visited:
                visited.add(curr)
                for nxt in adj[curr]:
                    if nxt not in visited:
                        stack.append(nxt)

        has_path = any(e in visited for e in end_nodes)
        if not has_path:
            errors.append("There is no connected path from the Start node to any End node.")

    return ValidationResult(
        valid=len(errors) == 0,
        errors=errors,
        warnings=warnings
    )
