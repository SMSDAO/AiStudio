/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Workflow Factory & Automation Engine View
 * Section 12 Specification:
 * - Visual DAG workflow steps
 * - Triggers, agent tasks, conditional steps, human approval gate
 * - Real-time step execution timeline and execution run history
 */

import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  Plus, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Bot, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { workflowEngineService, WorkflowDefinition, WorkflowExecutionRun } from '../services/workflowEngineService';
import { FlashGlowCard } from './FlashGlowCard';

export const WorkflowFactoryView: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(() => workflowEngineService.getAllWorkflows());
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(() => workflows[0] || null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeRun, setActiveRun] = useState<WorkflowExecutionRun | null>(null);

  const handleRunWorkflow = async () => {
    if (!selectedWorkflow || isRunning) return;
    setIsRunning(true);
    try {
      const run = await workflowEngineService.triggerWorkflow(selectedWorkflow.id);
      setActiveRun(run);
      setWorkflows([...workflowEngineService.getAllWorkflows()]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApproveStep = (stepId: string) => {
    if (!activeRun) return;
    const updated = workflowEngineService.approveStep(activeRun.runId, stepId);
    setActiveRun(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <FlashGlowCard variant="orange" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                WORKFLOW & AUTOMATION FACTORY V12.0.0
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Declarative DAG Engine Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Universal Workflow Orchestrator
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Construct multi-agent automated pipelines with sequential tasks, conditional branches, tool invocations, and human approval gates.
            </p>
          </div>

          <button
            onClick={handleRunWorkflow}
            disabled={isRunning || !selectedWorkflow}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunning ? 'Running Pipeline...' : 'Trigger Workflow Run'}</span>
          </button>
        </div>
      </FlashGlowCard>

      {/* Main Workflow DAG Canvas */}
      {selectedWorkflow && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#0B1019] p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-orange-400" />
                {selectedWorkflow.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedWorkflow.description}</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Total Executions: {selectedWorkflow.executionCount}
            </span>
          </div>

          {/* Visual Step Pipeline Graph */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {selectedWorkflow.steps.map((step, idx) => {
              const isWaiting = activeRun?.status === 'PAUSED_APPROVAL' && step.type === 'human_approval';

              return (
                <FlashGlowCard
                  key={step.id}
                  variant={isWaiting ? 'red' : step.type === 'human_approval' ? 'yellow' : 'orange'}
                  intensity={isWaiting ? 'high' : 'medium'}
                  className="p-5 space-y-3 relative"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400">STEP {idx + 1}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isWaiting 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {step.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">{step.name}</div>

                  {step.assignedAgentId && (
                    <div className="text-[11px] font-mono text-orange-300 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" />
                      <span>{step.assignedAgentId}</span>
                    </div>
                  )}

                  {isWaiting && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-[11px] text-red-300 font-mono block">Action Required:</span>
                      <button
                        onClick={() => handleApproveStep(step.id)}
                        className="w-full py-1.5 px-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve Release</span>
                      </button>
                    </div>
                  )}
                </FlashGlowCard>
              );
            })}
          </div>

          {/* Execution Telemetry Run Log */}
          {activeRun && (
            <FlashGlowCard variant="green" intensity="subtle" className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Live Execution Telemetry: Run {activeRun.runId}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  activeRun.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {activeRun.status}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(activeRun.stepResults).map(([stepId, res]) => (
                  <div key={stepId} className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-300">• Step ID: {stepId}</span>
                    <span className="text-emerald-400 font-bold">{res.status} ({res.durationMs} ms)</span>
                  </div>
                ))}
              </div>
            </FlashGlowCard>
          )}
        </div>
      )}
    </div>
  );
};
