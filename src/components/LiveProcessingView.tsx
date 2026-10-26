import React from 'react';
import {
  Activity,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Terminal,
  Sparkles,
  StopCircle,
  Layers,
} from 'lucide-react';
import { AgentId, AgentStatus } from '../types';
import { AGENT_REGISTRY } from '../data/agentMetadata';
import { AgentAvatar } from './AgentAvatar';

interface LiveProcessingViewProps {
  agentStatuses: Record<AgentId, AgentStatus>;
  agentProgress: Record<AgentId, { currentStep: number; totalSteps: number; stepDescription: string; percent: number }>;
  selectedAgentIds: Set<AgentId>;
  liveTelemetryLogs: { timestamp: string; agentId: AgentId; message: string; severity?: 'info' | 'warn' | 'success' }[];
  onStartAnalysis: () => void;
  onCancelAgent: (id: AgentId) => void;
  onRerunAgent: (id: AgentId) => void;
  onNavigateToResults: (targetAgent?: AgentId) => void;
  onNavigateToExecutive: () => void;
}

export const LiveProcessingView: React.FC<LiveProcessingViewProps> = ({
  agentStatuses,
  agentProgress,
  selectedAgentIds,
  liveTelemetryLogs,
  onStartAnalysis,
  onCancelAgent,
  onRerunAgent,
  onNavigateToResults,
  onNavigateToExecutive,
}) => {
  const isAnyProcessing = Object.values(agentStatuses).some((s) => s === 'Processing');
  const completedCount = Object.values(agentStatuses).filter((s) => s === 'Completed').length;
  const allCompleted = selectedAgentIds.size > 0 && completedCount === selectedAgentIds.size;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Pipeline Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/80 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              Parallel Multi-Agent Execution Monitor
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isAnyProcessing
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : allCompleted
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAnyProcessing ? 'Active Processing Wave' : allCompleted ? 'All Agents Finished' : 'Idle / Ready'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time parallel execution traces. Agents operate concurrently as independent tasks, streaming findings directly to shared clinical memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAnyProcessing ? (
            <button
              onClick={onStartAnalysis}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Re-run Selected Analyses
            </button>
          ) : (
            <span className="text-xs text-amber-300 font-medium flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Parallel Inference Streaming...
            </span>
          )}

          {completedCount > 0 && (
            <button
              onClick={() => onNavigateToResults()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center gap-1.5"
            >
              View Results <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* The 4 Agent Parallel Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(AGENT_REGISTRY) as AgentId[]).map((agentId) => {
          const agent = AGENT_REGISTRY[agentId];
          const status = agentStatuses[agentId];
          const progress = agentProgress[agentId] || { currentStep: 0, totalSteps: 6, stepDescription: 'Waiting in queue', percent: 0 };
          const isSelected = selectedAgentIds.has(agentId);
          const isWorking = status === 'Processing';

          return (
            <div
              key={agentId}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isWorking
                  ? 'bg-slate-900/90 border-teal-500/60 shadow-xl shadow-teal-500/10'
                  : status === 'Completed'
                  ? 'bg-slate-900/70 border-emerald-500/40'
                  : isSelected
                  ? 'bg-slate-900/50 border-slate-700'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              {/* Top Row: Avatar & Identity */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <AgentAvatar agentId={agentId} status={status} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-400">{agent.roomNumber}</span>
                        <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                  </div>

                  {/* Actions for this agent */}
                  <div className="flex items-center gap-1.5">
                    {isWorking ? (
                      <button
                        onClick={() => onCancelAgent(agentId)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 flex items-center gap-1"
                        title="Cancel task"
                      >
                        <StopCircle className="w-3 h-3" /> Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => onRerunAgent(agentId)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1"
                        title="Re-run single agent"
                      >
                        <RotateCcw className="w-3 h-3 text-teal-400" /> Rerun
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[240px]">
                      {progress.stepDescription}
                    </span>
                    <span className="font-mono text-teal-300 font-bold">{progress.percent}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        status === 'Completed'
                          ? 'bg-emerald-400'
                          : isWorking
                          ? 'bg-gradient-to-r from-teal-400 to-sky-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Step {progress.currentStep} of {progress.totalSteps}
                    </span>
                    <span>{status === 'Completed' ? 'Analytical Output Ready' : isWorking ? 'Simulated Parallel Thread' : 'Standby'}</span>
                  </div>
                </div>

                {/* Agent Tasks Execution Step Checklist */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                  {agent.tasksList.map((task, idx) => {
                    const stepNum = idx + 1;
                    const isDone = progress.currentStep > stepNum || status === 'Completed';
                    const isCurrent = progress.currentStep === stepNum && isWorking;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs py-0.5 px-2 rounded-md ${
                          isCurrent
                            ? 'bg-amber-500/10 text-amber-300 font-medium'
                            : isDone
                            ? 'text-emerald-400/90'
                            : 'text-slate-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[9px] flex items-center justify-center shrink-0">
                            {stepNum}
                          </span>
                        )}
                        <span className="truncate">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Jump */}
              {status === 'Completed' && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => onNavigateToResults(agentId)}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    View Agent Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Findings Telemetry Stream Panel */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">Real-Time Clinical Telemetry & Findings Stream</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">STDOUT/PARALLEL_STREAM</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono text-xs max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
          {liveTelemetryLogs.length === 0 ? (
            <p className="text-slate-600 italic">No telemetry events logged yet. Start analysis to observe execution stream.</p>
          ) : (
            liveTelemetryLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="text-teal-400 shrink-0 font-semibold">[{log.agentId}]</span>
                <span
                  className={`${
                    log.severity === 'warn'
                      ? 'text-amber-300'
                      : log.severity === 'success'
                      ? 'text-emerald-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
