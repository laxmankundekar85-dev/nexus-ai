import logging
import time
from typing import Dict, Any, Callable, Optional, Awaitable
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class ToolDefinition(BaseModel):
    name: str
    description: str
    required_permissions: list[str] = []
    timeout_seconds: float = 30.0

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Callable[..., Awaitable[Dict[str, Any]]]] = {}
        self._definitions: Dict[str, ToolDefinition] = {}

    def register(
        self,
        name: str,
        description: str,
        func: Callable[..., Awaitable[Dict[str, Any]]],
        required_permissions: Optional[list[str]] = None,
        timeout_seconds: float = 30.0
    ):
        self._tools[name] = func
        self._definitions[name] = ToolDefinition(
            name=name,
            description=description,
            required_permissions=required_permissions or [],
            timeout_seconds=timeout_seconds
        )

    def get_tool(self, name: str):
        return self._tools.get(name)

    def list_tools(self) -> list[Dict[str, Any]]:
        return [defn.model_dump() for defn in self._definitions.values()]

    async def execute(
        self,
        name: str,
        params: Dict[str, Any],
        user_id: str,
        execution_id: str,
        user_permissions: Optional[list[str]] = None
    ) -> Dict[str, Any]:
        if name not in self._tools:
            return {"error": f"Tool '{name}' not found", "success": False}

        defn = self._definitions[name]
        user_perms = user_permissions or ["*"]
        if "*" not in user_perms:
            for req in defn.required_permissions:
                if req not in user_perms:
                    return {"error": f"Permission denied for tool '{name}'. Required: {req}", "success": False}

        start_time = time.time()
        try:
            func = self._tools[name]
            result = await func(params=params, user_id=user_id, execution_id=execution_id)
            duration = round(time.time() - start_time, 3)
            return {
                "tool": name,
                "success": True,
                "result": result,
                "duration_seconds": duration
            }
        except Exception as e:
            logger.error(f"Error executing tool {name}: {e}")
            return {
                "tool": name,
                "success": False,
                "error": str(e),
                "duration_seconds": round(time.time() - start_time, 3)
            }

tool_registry = ToolRegistry()
