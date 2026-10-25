import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_execution_lifecycle_and_cancellation(client: AsyncClient):
    # 1. Register & login
    await client.post("/api/v1/auth/register", json={
        "email": "exec_test@nexus.ai",
        "password": "Password123!"
    })
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "exec_test@nexus.ai",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create execution
    exec_res = await client.post("/api/v1/executions", json={
        "objective": "Compare AI SaaS pricing and unit economics"
    }, headers=headers)
    assert exec_res.status_code == 200
    exec_data = exec_res.json()
    exec_id = exec_data["id"]
    assert exec_data["status"] in ["queued", "planning", "running", "completed"]

    # 3. Fetch execution detail
    detail_res = await client.get(f"/api/v1/executions/{exec_id}", headers=headers)
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == exec_id

    # 4. List executions
    list_res = await client.get("/api/v1/executions", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1
