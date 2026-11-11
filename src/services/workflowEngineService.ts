/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Universal Workflow & Automation Engine
 * Section 12 Specification:
 * Visual/Declarative DAG workflow execution, triggers, agent assignments,
 * human approvals, loops, and step-by-step execution timeline.
 */

export type WorkflowTriggerType = 'manual' | 'webhook' | 'schedule' | 'event';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent_task' | 'conditional' | 'human_approval' | 'tool_call' | 'notification';
  assignedAgentId?: string;
  assignedModelId?: string;
  config: Record<string, any>;
  dependencies: string[]; // step IDs
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_APPROVAL';
  output?: Record<string, any>;
  durationMs?: number;
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  triggerConfig: Record<string, any>;
  steps: WorkflowStep[];
  isActive: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
}

export interface WorkflowExecutionRun {
  runId: string;
  workflowId: string;
  workflowName: string;
  triggerSource: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED_APPROVAL';
  stepResults: Record<string, { status: string; output: any; durationMs: number }>;
  startedAt: string;
  completedAt?: string;
  totalDurationMs?: number;
  operator: string;
}

class WorkflowEngineService {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private runs: Map<string, WorkflowExecutionRun> = new Map();

  constructor() {
    this.seedDefaultWorkflows();
  }

  public getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  public getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  public getExecutionRuns(): WorkflowExecutionRun[] {
    return Array.from(this.runs.values());
  }

  public createWorkflow(params: {
    name: string;
    description: string;
    triggerType: WorkflowTriggerType;
    steps: WorkflowStep[];
  }): WorkflowDefinition {
    const id = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newWorkflow: WorkflowDefinition = {
      id,
      name: params.name,
      description: params.description,
      triggerType: params.triggerType,
      triggerConfig: {},
      steps: params.steps,
      isActive: true,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 0
    };
    this.workflows.set(id, newWorkflow);
    return newWorkflow;
  }

  public async triggerWorkflow(workflowId: string, operator = 'gxqstudio@gmail.com'): Promise<WorkflowExecutionRun> {
    const wf = this.workflows.get(workflowId);
    if (!wf) throw new Error(`Workflow ${workflowId} not found`);

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = performance.now();

    const run: WorkflowExecutionRun = {
      runId,
      workflowId: wf.id,
      workflowName: wf.name,
      triggerSource: wf.triggerType,
      status: 'RUNNING',
      stepResults: {},
      startedAt: new Date().toISOString(),
      operator
    };

    // Sequential/DAG execution simulation
    for (const step of wf.steps) {
      const stepStart = performance.now();
      step.status = 'RUNNING';

      // If approval step, pause for human approval
      if (step.type === 'human_approval') {
        step.status = 'WAITING_APPROVAL';
        run.status = 'PAUSED_APPROVAL';
        run.stepResults[step.id] = {
          status: 'WAITING_APPROVAL',
          output: { prompt: step.config.prompt || 'Approve production deployment' },
          durationMs: 0
        };
        this.runs.set(runId, run);
        return run;
      }

      // Simulated step execution latency
      await new Promise((r) => setTimeout(r, 60));
      const stepDuration = Math.round(performance.now() - stepStart);
      step.status = 'COMPLETED';

      run.stepResults[step.id] = {
        status: 'COMPLETED',
        output: { result: `Output from ${step.name}`, timestamp: Date.now() },
        durationMs: stepDuration
      };
    }

    run.status = 'COMPLETED';
    run.completedAt = new Date().toISOString();
    run.totalDurationMs = Math.round(performance.now() - startTime);

    wf.executionCount += 1;
    wf.updatedAt = new Date().toISOString();

    this.runs.set(runId, run);
    return run;
  }

  public approveStep(runId: string, stepId: string): WorkflowExecutionRun {
    const run = this.runs.get(runId);
    if (!run) throw new Error(`Execution run ${runId} not found`);

    run.stepResults[stepId] = {
      status: 'COMPLETED',
      output: { approved: true, approvedBy: 'gxqstudio@gmail.com', timestamp: Date.now() },
      durationMs: 12
    };

    run.status = 'COMPLETED';
    run.completedAt = new Date().toISOString();
    return { ...run };
  }

  private seedDefaultWorkflows(): void {
    const defaultWorkflow: WorkflowDefinition = {
      id: 'wf_ci_cd_autonomous',
      name: 'Autonomous Code Synthesis & Vercel Edge Deploy',
      description: 'Orchestrates requirements analysis, code AST generation, security scan, and Vercel edge deployment.',
      triggerType: 'manual',
      triggerConfig: {},
      steps: [
        {
          id: 'step_req',
          name: '1. Requirements Extraction',
          type: 'agent_task',
          assignedAgentId: 'agent_master_orchestrator',
          assignedModelId: 'gemini-2.5-flash',
          config: {},
          dependencies: [],
          status: 'COMPLETED'
        },
        {
          id: 'step_synth',
          name: '2. Code Synthesis & AST Transform',
          type: 'agent_task',
          assignedAgentId: 'agent_elite_ui',
          assignedModelId: 'gemini-2.5-pro',
          config: {},
          dependencies: ['step_req'],
          status: 'COMPLETED'
        },
        {
          id: 'step_audit',
          name: '3. Security & Invariant Audit',
          type: 'agent_task',
          assignedAgentId: 'agent_qa_critic',
          assignedModelId: 'deepseek-r1',
          config: {},
          dependencies: ['step_synth'],
          status: 'COMPLETED'
        },
        {
          id: 'step_approval',
          name: '4. Super Admin Release Approval',
          type: 'human_approval',
          config: { prompt: 'Verify test results and approve production tag' },
          dependencies: ['step_audit'],
          status: 'COMPLETED'
        }
      ],
      isActive: true,
      version: '1.0.0',
      createdAt: '2026-11-02T00:00:00Z',
      updatedAt: '2026-11-02T00:00:00Z',
      executionCount: 14
    };

    this.workflows.set(defaultWorkflow.id, defaultWorkflow);
  }
}

export const workflowEngineService = new WorkflowEngineService();
