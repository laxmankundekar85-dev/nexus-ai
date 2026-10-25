import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator

class Settings(BaseSettings):
    # Application
    APP_ENV: str = "development"
    APP_NAME: str = "Nexus AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "nexus-insecure-secret-key-change-in-production-123456"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for convenient dev
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database: fallback to local sqlite if postgres not configured/running
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./nexus.db",
        description="Async database connection string"
    )
    DATABASE_SYNC_URL: Optional[str] = "sqlite:///./nexus.db"

    POSTGRES_USER: str = "nexus"
    POSTGRES_PASSWORD: str = "nexuspassword"
    POSTGRES_DB: str = "nexus_ai"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # AI Provider: mock | openai | anthropic | gemini
    LLM_PROVIDER: str = "mock"
    LLM_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gpt-4o"
    LLM_BASE_URL: Optional[str] = None

    # Search Provider: mock | tavily | serpapi
    SEARCH_PROVIDER: str = "mock"
    SEARCH_API_KEY: Optional[str] = None

    # Storage
    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_PATH: str = "./storage/uploads"

    # CORS
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Limits
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    RATE_LIMIT_EXECUTIONS_PER_HOUR: int = 10
    MAX_EXECUTION_DURATION_SECONDS: int = 3600
    MAX_AGENT_ITERATIONS: int = 20
    MAX_TOOL_CALLS_PER_EXECUTION: int = 50
    MAX_UPLOAD_SIZE_MB: int = 50

    # Embeddings
    ENABLE_EMBEDDINGS: bool = False
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_SQL_QUERIES: bool = False

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def is_mock_mode(self) -> bool:
        return self.LLM_PROVIDER.lower() == "mock" or not self.LLM_API_KEY

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
