import pytest

@pytest.mark.asyncio
async def test_register_and_login(client):
    # Register
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": "test@nexus.ai",
        "password": "Password123!"
    })
    assert reg_res.status_code == 200
    user_data = reg_res.json()
    assert user_data["email"] == "test@nexus.ai"
    assert "id" in user_data

    # Login
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "test@nexus.ai",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Verify /me
    me_res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "test@nexus.ai"

@pytest.mark.asyncio
async def test_invalid_login(client):
    res = await client.post("/api/v1/auth/login", json={
        "email": "nonexistent@nexus.ai",
        "password": "wrong"
    })
    assert res.status_code == 400
