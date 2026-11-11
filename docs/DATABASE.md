# MASTER GODS AI STUDIO V12.0.0 — DATABASE PERSISTENCE ARCHITECTURE

## 1. Schema Invariants
- Dual-layer persistence: Prisma Schema (`/prisma/schema.prisma`) targeting PostgreSQL, backed by reactive client storage with state hydration.
- Strict foreign key relationships between Tenants, Users, Organizations, Projects, Files, Artifacts, Agents, Executions, and Audit Logs.

## 2. Key Entities
- `User`: Identity, address, role, credits, profile.
- `Project`: Project metadata, technology stack, files, executions.
- `Agent`: Agent capability manifest, tools, permissions, version history.
- `Execution`: DAG execution graph, task handoffs, traces, status.
- `Artifact`: Files, content, version array, SHA-256 checksums.
- `AuditLog`: Action, timestamp, operator, checksum, status.
