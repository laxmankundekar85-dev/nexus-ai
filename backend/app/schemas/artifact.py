from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel, Field

class ArtifactResponse(BaseModel):
    id: str
    artifact_type: str
    metadata: Dict[str, Any] = Field(default_factory=dict, validation_alias="meta_info")
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
