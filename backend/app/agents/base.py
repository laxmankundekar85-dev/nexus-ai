from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.core.config import settings

class AgentOutput(BaseModel):
    agent_role: str
    success: bool
    data: Dict[str, Any]
    summary: str
    tokens_used: int = 0
    error: Optional[str] = None

class BaseAgent(ABC):
    def __init__(self, role: str):
        self.role = role

    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> AgentOutput:
        pass
