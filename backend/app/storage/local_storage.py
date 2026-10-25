import os
import aiofiles
from pathlib import Path
from app.core.config import settings

class LocalStorage:
    def __init__(self, base_dir: str = None):
        self.base_dir = Path(base_dir or settings.LOCAL_STORAGE_PATH).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _resolve_safe_path(self, key: str) -> Path:
        """Prevent directory traversal attacks."""
        clean_key = os.path.normpath(key).lstrip("/\\")
        target_path = (self.base_dir / clean_key).resolve()
        if not str(target_path).startswith(str(self.base_dir)):
            raise ValueError("Path traversal attempt detected")
        return target_path

    async def save(self, key: str, content: bytes) -> str:
        file_path = self._resolve_safe_path(key)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        return str(file_path)

    async def load(self, key: str) -> bytes:
        file_path = self._resolve_safe_path(key)
        if not file_path.exists():
            raise FileNotFoundError(f"File {key} not found")
        async with aiofiles.open(file_path, "rb") as f:
            return await f.read()

    async def delete(self, key: str) -> bool:
        try:
            file_path = self._resolve_safe_path(key)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False

storage = LocalStorage()
