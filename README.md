# 🌌 Nexus AI — Enterprise Autonomous Agent Operating Platform

[![Live Platform](https://img.shields.io/badge/Live%20Platform-Vercel-black?style=for-the-badge&logo=vercel)](https://nexus-ai-ecru-nine.vercel.app/)
[![Android App](https://img.shields.io/badge/Android%20App-v2.0.0%20(Universal)-green?style=for-the-badge&logo=android)](https://nexus-ai-ecru-nine.vercel.app/NexusAI.apk)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Nexus AI** is an enterprise-grade autonomous agent operations platform where users define high-level strategic objectives, and an orchestrated mesh of specialized AI agents plan, research, compute, verify, and deliver production dossiers — backed by deterministic verification, human-in-the-loop approvals, tamper-evident audit logging, and standalone native Android delivery.

---

## 📑 Table of Contents

1. [Key Highlights & New Capabilities](#-key-highlights--new-capabilities)
2. [Platform Architecture](#-platform-architecture)
3. [Autonomous Agent Mesh](#-autonomous-agent-mesh)
4. [Full Feature Suite (17 Core Modules)](#-full-feature-suite-17-core-modules)
5. [Native Android Application (.apk)](#-native-android-application-apk)
6. [Technology Stack](#-technology-stack)
7. [Quick Start](#-quick-start)
   - [Option A: Docker (Recommended)](#option-a-docker-compose)
   - [Option B: Local Development](#option-b-local-development)
8. [Configuration & Environment Variables](#-configuration--environment-variables)
9. [AI Provider Integration](#-ai-provider-integration)
10. [Database Migrations & Vector Search](#-database-migrations--vector-search)
11. [Testing Suite](#-testing-suite)
12. [Security & Governance](#-security--governance)
13. [Deployment](#-deployment)
14. [Troubleshooting](#-troubleshooting)

---

## 🚀 Key Highlights & New Capabilities

- 🤖 **6-Agent Autonomous Mesh**: Planner, Research, Document, Analysis, Reviewer, and Report agents working synchronously with LangGraph-style state coordination.
- 📱 **Pure Native Android Application**: Standalone APK (`ai.nexus.app`) compiled for **all Android versions (Android 5.0 through 11, 12, 13, 14, 15, and 16+)** with **zero Google Chrome notifications**, persistent login, YouTube-style pull-to-refresh, and native lockscreen task completion alerts.
- 📊 **Data Analysis & Computation Lab**: AST-verified mathematical sandbox for pandas & NumPy emulation, interactive SVG charts (bar, line, donut), and descriptive statistics.
- 🕸️ **Interactive Knowledge Graph**: SVG-rendered entity networks with node relationship exploration and temporal diffing.
- 🔒 **Tamper-Evident SHA-256 Audit Trail**: Chained hash logs tracking every prompt, model invocation, and tool execution with actor signatures.
- ⏱️ **Scheduled Missions & Supervisor**: Recurring cron scheduling with delta alerts and a 10-state finite state machine with automated circuit breakers and self-healing recovery.
- 🌓 **Enterprise Dark / Light UI**: Tailored with reactive Tailwind styling, smooth CSS transitions, and full responsive mobile/desktop drawer navigation.

---

## 🏛️ Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NEXUS AI CLIENT LAYER                                 │
│                                                                             │
│   Web Application (React 18 + TS)    │   Native Android APK (WebView Engine)│
│   • Vercel Edge Global Hosting       │   • ai.nexus.app (SDK 21 - 36+)      │
│   • PWA Service Worker v3 Offline    │   • NexusNativeBridge Push Alerts    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / SSE Real-Time Streaming
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    ENTERPRISE BACKEND (FastAPI + Python)                    │
│                                                                             │
│  • Auth & RBAC (JWT + Bcrypt)        • Mission Supervisor (10-State DAG)    │
│  • Vector Chunking & Ingestion       • AST Python Analysis Sandbox          │
│  • Human-in-the-Loop Approvals       • SHA-256 Chained Audit Trail          │
└──────────────┬──────────────────────────────────────────┬───────────────────┘
               │ SQLAlchemy Async                         │ Celery Workers
┌──────────────▼─────────────┐             ┌──────────────▼───────────────────┐
│     PostgreSQL 15 + pgv    │             │         Redis 7 Message Bus      │
│   • Vector Embeddings (1536)│            │   • Pub/Sub Real-time Events     │
│   • Execution Logs & State │             │   • Asynchronous Task Queue      │
└────────────────────────────┘             └──────────────────┬───────────────┘
                                                              │
                                           ┌──────────────────▼───────────────┐
                                           │       AI ORCHESTRATOR MESH       │
                                           │   Planner ──► Research           │
                                           │      │           │               │
                                           │   Document ◄─────┘               │
                                           │      │                           │
                                           │   Analysis ──► Reviewer ──►Report│
                                           └──────────────────────────────────┘
```

---

## 🤖 Autonomous Agent Mesh

Each mission is partitioned and executed by specialized, collaborative agents:

| Agent | Core Responsibility | Verification & Tooling |
|---|---|---|
| **Planner Agent** | Deconstructs complex objectives into DAG tasks with sequential dependencies. | Dependency validation & cycle detection. |
| **Research Agent** | Gathers real-time external intelligence and web context. | Source credibility scoring & Tavily / SerpAPI search. |
| **Document Agent** | Ingests enterprise PDFs, TXTs, and docs into semantic embeddings. | Cosine similarity vector search via `pgvector`. |
| **Analysis Agent** | Performs mathematical calculations, syntheses, and tabular diffs. | AST-isolated mathematical sandbox (pandas/NumPy). |
| **Reviewer Agent** | Audits factuality, citation integrity, and identifies hallucination risks. | Claim lineage & confidence verification index. |
| **Report Agent** | Compiles executive dossiers, actionable takeaways, and citation footnotes. | Markdown generation & exportable PDF engine. |

---

## 📦 Full Feature Suite (17 Core Modules)

Nexus AI includes 17 purpose-built enterprise modules:

### 1. Operations & Execution
- **Dashboard** (`/dashboard`): Real-time system telemetry, agent status grid, active mission throughput, and system health counters.
- **AI Workspace** (`/workspace`): Live objective input, interactive agent coordination canvas, streaming logs, and execution timeline.
- **Mission Supervisor** (`/supervisor`): 10-state DAG execution control, interactive step-by-step progress, pause/resume, and retry gates.
- **Workflow Builder** (`/workflows`): Drag-and-drop visual agent DAG editor powered by `@xyflow/react` with custom node routing.
- **Mission History & Replay** (`/mission-history`): Historical execution timelines, branching analysis, and full telemetry replay.
- **Scheduled Missions** (`/schedules`): Automated recurring missions with cron cadence and delta alert thresholds.
- **Execution Recovery** (`/execution-recovery`): Automated self-healing loops, circuit breakers, and fault-tolerant fallback policies.

### 2. Knowledge & Intelligence
- **Document Intelligence** (`/documents`): Corpus file upload, chunk viewer, semantic search, and side-by-side document comparison.
- **Intelligence Reports** (`/reports`): Dossier viewer with executive takeaways, source citations, evidence lists, and Markdown download.
- **Evidence Explorer** (`/evidence`): Claim verification tracking, confidence rating indicators, and interactive evidence drawers.
- **Knowledge Graph** (`/knowledge-graph`): Interactive SVG entity graph with node relationship filtering and temporal diffs.
- **Source Freshness** (`/source-freshness`): Real-time staleness monitoring, scheduled re-validation triggers, and cache telemetry.

### 3. Analytics & Quality
- **Data Analysis & Computation Lab** (`/analysis-lab`): Clean prompt input for mathematical computations, AST Python execution, and interactive SVG bar/line/pie charts.
- **AI Evaluation & Benchmarks** (`/evaluation`): Golden dataset benchmarks comparing multi-model performance (GPT-4o vs Claude 3.5 Sonnet vs Gemini 1.5 Pro).

### 4. Security & Administration
- **Security & Permissions** (`/security`): Tool gateway controls, human-in-the-loop approval requests, and policy enforcement.
- **Audit Trail** (`/audit-trail`): Chained SHA-256 tamper-evident log entries with hash verification and JSON/CSV export.
- **Settings** (`/settings`): Dynamic LLM provider switching, dark/light theme controls, system diagnostics, and native APK package status.

---

## 📱 Native Android Application (.apk)

Nexus AI includes a standalone native Android project located in [`android-native/`](./android-native).

```
Direct Download: https://nexus-ai-ecru-nine.vercel.app/NexusAI.apk
Package ID:      ai.nexus.app
Compatibility:   Android 5.0 (Lollipop) up to Android 16+ (All Versions)
SDK Versions:    minSdkVersion 21 | compileSdkVersion 35 | targetSdkVersion 35
```

### Key Native Capabilities:
- **Zero Chrome Notifications**: Runs as an isolated native Android application (`ai.nexus.app`) using Android's native WebView engine, completely eliminating Chrome Custom Tab notifications and "Running in Chrome" banners.
- **Lockscreen & Notification Shade Alerts**: Built-in `NexusNativeBridge` posts native Android notifications on channel `nexus_ai_tasks` with vibration and app icons whenever background missions complete.
- **YouTube-Style Pull-to-Refresh**: Calibrated touch interception so swiping down while scrolled down seamlessly scrolls up; pull-to-refresh triggers only when already at the root scroll boundary.
- **Persistent Sessions**: Native DOM storage and database persistence keep authentication sessions active across app restarts.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Single-page enterprise app with code-split routing |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive modern design with dynamic dark/monolith theme |
| **Workflow Canvas** | `@xyflow/react` (React Flow 12) | Visual DAG builder and agent connection canvas |
| **State & Cache** | TanStack Query v5 | Reactive cache and data synchronization |
| **Mobile Shell** | Android Native Java, AndroidX | Standalone WebView with native Android bridge |
| **Backend API** | Python 3.11+, FastAPI | Async REST API with OpenAPI/Swagger docs |
| **AI Orchestration** | LangGraph, LangChain | Multi-agent state machine and cyclic workflow routing |
| **Database** | PostgreSQL 15 + `pgvector` | Relational application state + 1536-dim vector store |
| **Queue & Pub/Sub** | Redis 7 + Celery | Task distribution and Server-Sent Events (SSE) bus |
| **Security** | JWT, Bcrypt, SHA-256 | Token auth, password hashing, tamper-evident audit logging |

---

## 🚀 Quick Start

### Option A: Docker Compose

The fastest way to spin up the complete stack with PostgreSQL and Redis:

```bash
# 1. Clone the repository
git clone https://github.com/laxmankundekar85-dev/nexus-ai.git
cd nexus-ai

# 2. Configure environment
cp .env.example .env

# 3. Start PostgreSQL with pgvector and Redis
docker-compose up -d

# 4. Initialize backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 5. In a separate terminal, launch frontend
cd ../frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

### Option B: Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Compiling the Android APK Locally
If you have the Android SDK and Gradle installed:
```bash
cd android-native
gradle assembleRelease
# The signed APK is built at: app/build/outputs/apk/release/app-release.apk
```

---

## ⚙️ Configuration & Environment Variables

Create `.env` from `.env.example`:

```env
# Application
APP_ENV=development
DEBUG=true
SECRET_KEY=generate-a-secure-32-byte-hex-key

# Database & Cache
DATABASE_URL=postgresql+asyncpg://nexus:nexuspassword@localhost:5432/nexus_ai
DATABASE_SYNC_URL=postgresql://nexus:nexuspassword@localhost:5432/nexus_ai
REDIS_URL=redis://localhost:6379/0

# Storage
STORAGE_BACKEND=local
LOCAL_STORAGE_PATH=./storage/uploads
MAX_UPLOAD_SIZE_MB=50

# AI Provider (openai | anthropic | gemini | mock)
LLM_PROVIDER=mock
LLM_API_KEY=
LLM_MODEL=gpt-4o

# Search Provider (tavily | serpapi | mock)
SEARCH_PROVIDER=mock
SEARCH_API_KEY=
```

> 💡 **Mock Mode**: Running with `LLM_PROVIDER=mock` requires **no external API keys** and produces simulated agent executions, making it ideal for UI testing and evaluation.

---

## 🔌 AI Provider Integration

Switch between AI providers seamlessly by setting the provider flag:

### OpenAI
```env
LLM_PROVIDER=openai
LLM_API_KEY=sk-proj-...
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
LLM_API_KEY=AIzaSy...
LLM_MODEL=gemini-1.5-pro
```

---

## 🧪 Testing Suite

Run the full automated test suite across backend and frontend:

```bash
# Backend unit & integration tests
cd backend
pytest tests/ -v --cov=app

# Frontend component & unit tests
cd frontend
npm run test
```

---

## 🛡️ Security & Governance

- **Server-Side API Key Isolation**: Client applications and Android devices never receive or store third-party LLM API keys.
- **AST Execution Sandbox**: Mathematical scripts in the Data Analysis Lab are analyzed via Abstract Syntax Trees to prohibit arbitrary shell calls, network sockets, or OS modifications.
- **Chained Audit Trail**: Security actions, tool executions, and model answers are hashed sequentially via SHA-256 for provable integrity.
- **Human-in-the-Loop Approvals**: High-impact actions (e.g. data modification or external API posting) require explicit user sign-off before completion.
- **Strict HTTPS & CORS**: Cross-Origin Resource Sharing is locked to authorized origins only.

---

## 🌐 Deployment

- **Frontend Deployment (Vercel)**:
  Connect the repository to Vercel. Output directory: `dist`. Build command: `npm run build`.
- **Backend Deployment**:
  Run behind Gunicorn/Uvicorn workers managed by systemd or Docker with PostgreSQL and Redis.
- **Native APK Distribution**:
  The compiled APK is served directly from the public asset directory at `/NexusAI.apk` for 1-tap mobile installation.

---
