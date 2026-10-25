import pytest
import io
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_document_upload_and_preview(client: AsyncClient):
    # 1. Register & login
    await client.post("/api/v1/auth/register", json={
        "email": "doc_test@nexus.ai",
        "password": "Password123!"
    })
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "doc_test@nexus.ai",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload text document
    file_content = b"Nexus AI Market Report: Autonomous workflows reduce manual intervention by 80%."
    files = {"file": ("report.txt", io.BytesIO(file_content), "text/plain")}

    upload_res = await client.post("/api/v1/documents/upload", files=files, headers=headers)
    assert upload_res.status_code == 200
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    assert doc_data["filename"] == "report.txt"

    # 3. List documents
    list_res = await client.get("/api/v1/documents", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 4. Text preview
    text_res = await client.get(f"/api/v1/documents/{doc_id}/text", headers=headers)
    assert text_res.status_code == 200

    # 5. Delete document
    del_res = await client.delete(f"/api/v1/documents/{doc_id}", headers=headers)
    assert del_res.status_code == 200
