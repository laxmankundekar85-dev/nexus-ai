# Nexus AI — AI Agent Operating Platform

> A platform where users provide high-level objectives and AI agents plan, execute, verify, and complete associated tasks — with full transparency, real-time progress tracking, and downloadable reports.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Quick Start (Docker)](#quick-start-docker)
6. [Manual Setup (Without Docker)](#manual-setup-without-docker)
7. [Environment Configuration](#environment-configuration)
8. [AI Provider Setup](#ai-provider-setup)
9. [Search Provider Setup](#search-provider-setup)
10. [Database Migrations](#database-migrations)
11. [Running the Backend](#running-the-backend)
12. [Running the Frontend](#running-the-frontend)
13. [Running Tests](#running-tests)
14. [API Documentation](#api-documentation)
15. [Mock / Demo Mode](#mock--demo-mode)
16. [File Storage](#file-storage)
17. [Deployment](#deployment)
18. [Known Limitations](#known-limitations)
19. [Security Considerations](#security-considerations)
20. [Troubleshooting](#troubleshooting)

---

## Product Overview

Nexus AI accepts a plain-language objective from a user, then:

1. Creates a structured execution plan (Planner Agent)
2. Researches relevant information from approved sources (Research Agent)
3. Retrieves relevant passages from uploaded documents (Document Agent)
4. Compares and analyzes collected evidence (Analysis Agent)
5. Reviews completeness and factual support (Reviewer Agent)
6. Generates a structured report with citations (Report Agent)
7. Waits for human approval before consequential external actions

All execution state, events, and artifacts are persisted to the database and visible in real time on the frontend.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  Landing │ Auth │ Dashboard │ Workspace │ Builder    │
│  Documents │ Reports │ Settings                      │
└────────────────────────┬────────────────────────────┘
                         │ HTTP + SSE
┌────────────────────────▼────────────────────────────┐
│                 Backend (FastAPI)                    │
│  Auth │ Workflows │ Executions │ Documents           │
│  Approvals │ Artifacts                               │
└──────────┬────────────────────────────┬─────────────┘
           │ SQLAlchemy                 │ Celery
┌──────────▼──────────┐    ┌───────────▼─────────────┐
│   PostgreSQL + pgv  │    │      Redis + Workers     │
│   (App data + vecs) │    │   (Queue + Pub/Sub SSE)  │
└─────────────────────┘    └─────────────────────────┘
                                        │
                        ┌───────────────▼──────────────┐
                        │      AI Orchestrator         │
                        │  LangGraph State Machine     │
                        │  Planner → Research →        │
                        │  Document → Analysis →       │
                        │  Reviewer → Report           │
                        └──────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + TypeScript + Vite | React 18 |
| Styling | Tailwind CSS | 3.x |
| Routing | React Router | v6 |
| Workflow Builder | @xyflow/react (React Flow) | 12.x |
| Data Fetching | TanStack Query | v5 |
| Backend | Python + FastAPI | Python 3.11+ |
| Validation | Pydantic | v2 |
| ORM | SQLAlchemy | 2.x |
| Migrations | Alembic | latest |
| Orchestration | LangGraph | latest |
| Database | PostgreSQL + pgvector | 15 |
| Cache / Queue | Redis + Celery | Redis 7 |
| Auth | JWT (python-jose) + bcrypt | - |

---

## Prerequisites

- **Python 3.11+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Docker Desktop** *(recommended)* — [docker.com](https://docker.com)
- OR: **PostgreSQL 15** and **Redis 7** installed locally

---

## Quick Start (Docker)

```bash
# 1. Clone / navigate to project
cd nexus-ai

# 2. Copy environment file
cp .env.example .env
# Edit .env — set SECRET_KEY at minimum (see below)

# 3. Start PostgreSQL + Redis
docker-compose up -d

# 4. Install backend dependencies
cd backend
pip install -r requirements.txt

# 5. Run database migrations
alembic upgrade head

# 6. Start backend (in backend/)
uvicorn app.main:app --reload --port 8000

# 7. In a new terminal — start frontend
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **No API keys needed** — the app runs in **Mock Mode** by default. See [Mock Mode](#mock--demo-mode).

---

## Manual Setup (Without Docker)

### PostgreSQL

1. Install PostgreSQL 15: [postgresql.org/download](https://www.postgresql.org/download/)
2. Install pgvector extension: [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)
3. Create database:
   ```sql
   CREATE USER nexus WITH PASSWORD 'nexuspassword';
   CREATE DATABASE nexus_ai OWNER nexus;
   \c nexus_ai
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Update `DATABASE_URL` in `.env`

### Redis

1. Windows: [github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)
2. Start Redis: `redis-server`
3. Update `REDIS_URL` in `.env`

---

## Environment Configuration

```bash
cp .env.example .env
```

Required settings:

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing key — generate with `openssl rand -hex 32` |
| `DATABASE_URL` | PostgreSQL async connection string |
| `REDIS_URL` | Redis connection URL |

Optional (for real AI):

| Variable | Description |
|---|---|
| `LLM_PROVIDER` | `openai`, `anthropic`, `gemini`, or `mock` |
| `LLM_API_KEY` | Your provider API key |
| `LLM_MODEL` | Model name e.g. `gpt-4o` |
| `SEARCH_PROVIDER` | `tavily`, `serpapi`, or `mock` |
| `SEARCH_API_KEY` | Search API key |

> ⚠️ Never commit `.env` to git. It is gitignored by default.

---

## AI Provider Setup

### OpenAI

```env
LLM_PROVIDER=openai
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o
```

### Anthropic Claude

```env
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-...
LLM_MODEL=claude-3-5-sonnet-20241022
```

### Google Gemini

```env
LLM_PROVIDER=gemini
LLM_API_KEY=AIza...
LLM_MODEL=gemini-1.5-pro
```

### Mock Mode (no API key)

```env
LLM_PROVIDER=mock
```

---

## Search Provider Setup

### Tavily (Recommended)

Get a free API key at [tavily.com](https://tavily.com):

```env
SEARCH_PROVIDER=tavily
SEARCH_API_KEY=tvly-...
```

### Mock (no API key)

```env
SEARCH_PROVIDER=mock
```

---

## Database Migrations

```bash
cd backend

# Apply all migrations
alembic upgrade head

# Create a new migration after model changes
alembic revision --autogenerate -m "description"

# Check current version
alembic current
```

---

## Running the Backend

```bash
cd backend

# Development (auto-reload)
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Start Celery worker (separate terminal)
celery -A workers.celery_app worker --loglevel=info
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v
pytest tests/ -v --cov=app  # With coverage

# Frontend tests
cd frontend
npm run test
npm run test -- --coverage
```

---

## API Documentation

With the backend running, open:

- **Interactive docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## Mock / Demo Mode

When `LLM_PROVIDER=mock` (default), the system:

- Generates deterministic example execution plans
- Returns mock research results with placeholder sources
- Produces a template report with sample findings
- Shows the full UI and execution flow

> ⚠️ Mock mode is clearly labeled in the UI and API responses. It is never presented as real AI execution.

---

## File Storage

By default, uploaded documents are stored in `./storage/uploads/` relative to the backend directory.

For production, set `STORAGE_BACKEND=s3` and configure S3 credentials. The storage abstraction layer (`app/storage/`) makes this switch transparent to the rest of the application.

---

## Deployment

1. Set `APP_ENV=production` and `DEBUG=false`
2. Generate a strong `SECRET_KEY`
3. Use a managed PostgreSQL + Redis service
4. Run `alembic upgrade head` before starting
5. Use a process manager (gunicorn / supervisord) for the backend
6. Build the frontend: `npm run build` and serve `dist/` via nginx or CDN
7. Set `CORS_ALLOWED_ORIGINS` to your frontend domain
8. Never set `LOG_SQL_QUERIES=true` in production

---

## Known Limitations

- **OCR**: Scanned PDFs require an OCR integration (Tesseract). Without it, scanned pages are reported as unreadable.
- **Parallel execution**: Tasks currently execute sequentially. Parallel execution for independent tasks is a planned enhancement.
- **Prompt injection**: Uploaded documents and web search results are treated as untrusted, but no system is fully immune to prompt injection. Review agent outputs before consequential actions.
- **Cost tracking**: Token cost estimation requires accurate pricing data from the provider. Estimates may be imprecise.
- **PDF generation**: Report PDF export requires `weasyprint` or `pdfkit`. Markdown download is always available.

---

## Security Considerations

- All API keys are stored server-side only, never in the frontend or logs
- All database queries use parameterized statements via SQLAlchemy
- Uploaded files are validated by type and size before processing
- Document contents are treated as untrusted — macros and embedded code are never executed
- Path traversal is prevented in the storage layer
- Every resource access enforces ownership checks
- Rate limiting is applied per user per endpoint
- JWT tokens can be invalidated server-side via Redis blacklist
- Significant security events are logged to the audit log

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `Connection refused` to PostgreSQL | Check Docker is running: `docker-compose ps` |
| `Connection refused` to Redis | Start Redis: `docker-compose up -d redis` |
| `JWT decode error` | Check SECRET_KEY matches between restarts |
| Frontend shows `Network Error` | Verify backend is running on port 8000 |
| Migrations fail | Ensure `DATABASE_SYNC_URL` is set correctly |
| Mock mode active unexpectedly | Check `LLM_PROVIDER` in `.env` |
| Upload fails | Check `MAX_UPLOAD_SIZE_MB` and `LOCAL_STORAGE_PATH` is writable |

For more help, check the [API docs](http://localhost:8000/docs) or open an issue.
