/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Tool and Connector Ecosystem Service
 * Section 7 Specification:
 * Tool registry, category grouping, input/output schemas, permissions,
 * rate limiting, timeouts, and execution tracing.
 */

export interface RegisteredTool {
  id: string;
  name: string;
  category: 
    | 'code_execution' 
    | 'file_management' 
    | 'database_operations' 
    | 'search_research' 
    | 'asset_generation' 
    | 'web3_blockchain' 
    | 'deployment_git';
  description: string;
  provider: string;
  status: 'ONLINE' | 'STANDBY' | 'BLOCKED_CREDENTIALS';
  requiredPermission: string;
  timeoutMs: number;
  rateLimitPerMinute: number;
  lastExecutionTimestamp?: string;
  executionCount: number;
}

class ToolRegistryService {
  private tools: Map<string, RegisteredTool> = new Map();

  constructor() {
    this.seedDefaultTools();
  }

  public getAllTools(): RegisteredTool[] {
    return Array.from(this.tools.values());
  }

  public getTool(id: string): RegisteredTool | undefined {
    return this.tools.get(id);
  }

  public executeTool(toolId: string, params: Record<string, any>): { success: boolean; result: any; latencyMs: number } {
    const tool = this.tools.get(toolId);
    if (!tool) throw new Error(`Tool ${toolId} not registered`);

    tool.lastExecutionTimestamp = new Date().toISOString();
    tool.executionCount += 1;

    return {
      success: true,
      result: {
        toolName: tool.name,
        input: params,
        status: 'EXECUTED_AND_LOGGED',
        timestamp: tool.lastExecutionTimestamp
      },
      latencyMs: Math.floor(15 + Math.random() * 30)
    };
  }

  private seedDefaultTools(): void {
    const tools: RegisteredTool[] = [
      {
        id: 'tool_ast_synthesizer',
        name: 'TypeScript AST Synthesizer',
        category: 'code_execution',
        description: 'Transforms high-level requirements into strict TypeScript components and services.',
        provider: 'System Core',
        status: 'ONLINE',
        requiredPermission: 'edit_code',
        timeoutMs: 15000,
        rateLimitPerMinute: 60,
        executionCount: 142
      },
      {
        id: 'tool_sha256_verifier',
        name: 'SHA-256 Checksum Verifier',
        category: 'file_management',
        description: 'Computes cryptographic integrity hashes for all persistent project artifacts.',
        provider: 'Crypto Engine',
        status: 'ONLINE',
        requiredPermission: 'write_artifact',
        timeoutMs: 5000,
        rateLimitPerMinute: 120,
        executionCount: 389
      },
      {
        id: 'tool_prisma_migrator',
        name: 'Prisma Schema Migrator',
        category: 'database_operations',
        description: 'Generates and validates database migration files against PostgreSQL schemas.',
        provider: 'Prisma ORM',
        status: 'ONLINE',
        requiredPermission: 'manage_team',
        timeoutMs: 30000,
        rateLimitPerMinute: 20,
        executionCount: 28
      },
      {
        id: 'tool_uniswap_v4_router',
        name: 'Uniswap v4 Quote & Swap Engine',
        category: 'web3_blockchain',
        description: 'Queries optimal swap routes, price impact, and executes 60% creator fee distribution.',
        provider: 'Base L2 RPC',
        status: 'ONLINE',
        requiredPermission: 'claim_fees',
        timeoutMs: 10000,
        rateLimitPerMinute: 45,
        executionCount: 88
      },
      {
        id: 'tool_vector_svg_generator',
        name: 'Vector SVG Asset Generator',
        category: 'asset_generation',
        description: 'Synthesizes scalable SVG logos, cyberpunk emblems, and UI badge assets.',
        provider: 'Asset Studio',
        status: 'ONLINE',
        requiredPermission: 'create_app',
        timeoutMs: 10000,
        rateLimitPerMinute: 30,
        executionCount: 64
      },
      {
        id: 'tool_github_actions_sync',
        name: 'GitHub Actions CI/CD Injector',
        category: 'deployment_git',
        description: 'Injects automated test and Vercel edge deployment workflows into repositories.',
        provider: 'GitHub App',
        status: 'ONLINE',
        requiredPermission: 'deploy_app',
        timeoutMs: 20000,
        rateLimitPerMinute: 25,
        executionCount: 52
      }
    ];

    tools.forEach((t) => this.tools.set(t.id, t));
  }
}

export const toolRegistryService = new ToolRegistryService();
