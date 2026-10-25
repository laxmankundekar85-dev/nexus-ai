import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_workflows_crud_and_isolation(client: AsyncClient):
    # User 1
    await client.post("/api/v1/auth/register", json={
        "email": "user1@nexus.ai",
        "password": "Password123!"
    })
    u1_login = await client.post("/api/v1/auth/login", json={
        "email": "user1@nexus.ai",
        "password": "Password123!"
    })
    token1 = u1_login.json()["access_token"]
    h1 = {"Authorization": f"Bearer {token1}"}

    # User 2
    await client.post("/api/v1/auth/register", json={
        "email": "user2@nexus.ai",
        "password": "Password123!"
    })
    u2_login = await client.post("/api/v1/auth/login", json={
        "email": "user2@nexus.ai",
        "password": "Password123!"
    })
    token2 = u2_login.json()["access_token"]
    h2 = {"Authorization": f"Bearer {token2}"}

    # User 1 creates workflow
    create_res = await client.post("/api/v1/workflows", json={
        "name": "Pipeline 1",
        "description": "User 1 pipeline",
        "workflow_definition": {
            "nodes": [
                {"id": "start-1", "type": "start", "position": {"x": 0, "y": 0}},
                {"id": "end-1", "type": "end", "position": {"x": 100, "y": 0}}
            ],
            "edges": [{"id": "e1", "source": "start-1", "target": "end-1"}]
        }
    }, headers=h1)
    assert create_res.status_code == 200
    wf_id = create_res.json()["id"]

    # User 1 can access it
    get_res = await client.get(f"/api/v1/workflows/{wf_id}", headers=h1)
    assert get_res.status_code == 200

    # User 2 cannot access User 1's workflow (Tenant isolation!)
    cross_res = await client.get(f"/api/v1/workflows/{wf_id}", headers=h2)
    assert cross_res.status_code == 404
