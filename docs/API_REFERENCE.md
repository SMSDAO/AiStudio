# MASTER GODS AI STUDIO V12.0.0 — API REFERENCE

## Core Endpoint Specifications

### 1. Agent & Execution APIs
- `POST /api/v1/orchestrator/plan`: Deconstructs user brief, queries capability registry, and assembles dynamic team.
- `POST /api/v1/agent-factory/create`: Synthesizes new specialist agent specification, input/output schemas, and system prompt.
- `GET /api/v1/agents/registry`: Returns persistent capability registry entries and availability.
- `POST /api/v1/executions/execute`: Starts DAG task graph execution with trace logging.

### 2. Model & Tool APIs
- `GET /api/v1/models`: Returns list of available models, context windows, and real-time latency.
- `POST /api/v1/models/route`: Evaluates prompt, applies routing rules, and executes with automated failover.
- `GET /api/v1/tools/registry`: Returns registry of connected tools, permissions, and timeout parameters.

### 3. Artifact & Workspace APIs
- `POST /api/v1/artifacts/operation`: Executes one of the 14 persistent file operations with SHA-256 verification.
- `GET /api/v1/artifacts/export`: Packages workspace manifest with integrity checksums.
