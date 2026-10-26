import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Play,
  CheckSquare,
  Square,
  Clock,
  Layers,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { AgentId, AgentStatus } from '../types';
import { AGENT_REGISTRY } from '../data/agentMetadata';
import { AgentAvatar } from './AgentAvatar';

interface VirtualOfficeProps {
  agentStatuses: Record<AgentId, AgentStatus>;
  agentProgress: Record<AgentId, { currentStep: number; totalSteps: number; stepDescription: string; percent: number }>;
  selectedAgentIds: Set<AgentId>;
  onToggleAgentSelect: (id: AgentId) => void;
  onSelectAllAgents: (select: boolean) => void;
  onOpenAgentWorkspace: (id: AgentId) => void;
  onOpenAgentConfig: (id: AgentId) => void;
  onStartAnalysis: () => void;
  onNavigateToData: () => void;
  onNavigateToExecutive: () => void;
  hasResults: boolean;
}

export const VirtualOffice: React.FC<VirtualOfficeProps> = ({
  agentStatuses,
  agentProgress,
  selectedAgentIds,
  onToggleAgentSelect,
  onSelectAllAgents,
  onOpenAgentWorkspace,
  onOpenAgentConfig,
  onStartAnalysis,
  onNavigateToData,
  onNavigateToExecutive,
  hasResults,
}) => {
  const allSelected = selectedAgentIds.size === 4;
  const isAnyProcessing = Object.values(agentStatuses).some((s) => s === 'Processing');
  const completedCount = Object.values(agentStatuses).filter((s) => s === 'Completed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Portal Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Decorative background glow & grid */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Autonomous Clinical Ops Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Welcome to the Clinical AI Virtual Office
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Four specialized healthcare agents work in parallel from their dedicated suites. Upload clinical cohorts or patient feedback datasets to trigger coordinated sentiment analysis, systemic experience audits, clinical complaint severity triage, and executive management decision support.
            </p>
          </div>

          {/* Quick Action Station */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectAllAgents(!allSelected)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
              >
                {allSelected ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-teal-400" /> Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-400" /> Select All 4 Agents
                  </>
                )}
              </button>

              <button
                onClick={onNavigateToData}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-400" /> Manage Dataset
              </button>
            </div>

            <button
              onClick={onStartAnalysis}
              disabled={isAnyProcessing || selectedAgentIds.size === 0}
              className={`w-full px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                isAnyProcessing
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                  : selectedAgentIds.size === 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 via-sky-600 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-teal-500/20 active:scale-98'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isAnyProcessing ? 'Processing in Progress...' : `Analyze Data with ${selectedAgentIds.size} Selected Agent(s)`}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Activity Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <div>
            <span className="text-slate-400 block text-[11px]">Idle Agents</span>
            <span className="font-bold text-slate-200 text-sm">
              {Object.values(agentStatuses).filter((s) => s === 'Idle').length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          <div>
            <span className="text-slate-400 block text-[11px]">Selected</span>
            <span className="font-bold text-teal-300 text-sm">{selectedAgentIds.size}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <div>
            <span className="text-slate-400 block text-[11px]">Processing</span>
            <span className="font-bold text-amber-300 text-sm">
              {Object.values(agentStatuses).filter((s) => s === 'Processing').length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div>
            <span className="text-slate-400 block text-[11px]">Completed</span>
            <span className="font-bold text-emerald-300 text-sm">{completedCount}</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-slate-400 block text-[11px]">Cross-Agent Synthesis</span>
            <span className="font-semibold text-slate-200 text-xs">
              {completedCount === 4 ? 'Ready for Executive' : `${completedCount}/4 Completed`}
            </span>
          </div>
          {completedCount > 0 && (
            <button
              onClick={onNavigateToExecutive}
              className="text-teal-400 hover:text-teal-300 text-xs flex items-center font-medium"
            >
              View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* The Four Virtual Office Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(AGENT_REGISTRY) as AgentId[]).map((agentId) => {
          const agent = AGENT_REGISTRY[agentId];
          const status = agentStatuses[agentId];
          const isSelected = selectedAgentIds.has(agentId);
          const progress = agentProgress[agentId];
          const isWorking = status === 'Processing';

          // Office theme styling
          const getRoomStyle = () => {
            switch (agentId) {
              case 'agent-1':
                return {
                  border: isWorking ? 'border-teal-400' : isSelected ? 'border-teal-500/60' : 'border-slate-800',
                  glow: 'hover:border-teal-500/40 hover:shadow-teal-500/10',
                  badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
                  accentBg: 'bg-teal-500/10',
                  progressBar: 'bg-teal-400',
                  officeTag: 'Quality Improvement Suite',
                };
              case 'agent-2':
                return {
                  border: isWorking ? 'border-blue-400' : isSelected ? 'border-blue-500/60' : 'border-slate-800',
                  glow: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
                  badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                  accentBg: 'bg-blue-500/10',
                  progressBar: 'bg-blue-400',
                  officeTag: 'Health Equity & Disparities Lab',
                };
              case 'agent-3':
                return {
                  border: isWorking ? 'border-rose-400' : isSelected ? 'border-rose-500/60' : 'border-slate-800',
                  glow: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
                  badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
                  accentBg: 'bg-rose-500/10',
                  progressBar: 'bg-rose-400',
                  officeTag: 'Rapid Safety & Grievance Triage',
                };
              case 'agent-4':
                return {
                  border: isWorking ? 'border-purple-400' : isSelected ? 'border-purple-500/60' : 'border-slate-800',
                  glow: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
                  badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                  accentBg: 'bg-purple-500/10',
                  progressBar: 'bg-purple-400',
                  officeTag: 'Executive Leadership Boardroom',
                };
            }
          };

          const style = getRoomStyle();

          return (
            <div
              key={agentId}
              className={`relative rounded-3xl bg-slate-900/80 backdrop-blur-md border ${style.border} ${style.glow} p-6 shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
            >
              {/* Virtual Office Room Backdrop Architecture */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Working active halo behind card */}
              {isWorking && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
              )}

              {/* Room Header & Room Badge */}
              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-700">
                      {agent.roomNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {style.officeTag}
                    </span>
                  </div>

                  {/* Room Selection Checkbox Control */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleAgentSelect(agentId)}
                      disabled={isWorking}
                      className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-900 bg-slate-800"
                    />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-400'}`}>
                      {isSelected ? 'Active Agent' : 'Select Agent'}
                    </span>
                  </label>
                </div>

                {/* Agent Office Suite Body (Clickable to open workspace/results) */}
                <div
                  onClick={() => onOpenAgentWorkspace(agentId)}
                  className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 cursor-pointer"
                >
                  {/* Clickable Representative Avatar in Office */}
                  <div className="relative shrink-0">
                    <AgentAvatar agentId={agentId} status={status} size="xl" />
                  </div>

                  {/* Agent Profile & Office Description */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">{agent.credentials}</span>
                    </div>

                    <p className="text-xs font-semibold text-teal-400">{agent.role}</p>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{agent.description}</p>
                  </div>
                </div>

                {/* Analytical Tasks Checklist Preview */}
                <div className="mt-5 pt-4 border-t border-slate-800/60">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Standard Analytical Pipeline:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {agent.tasksList.slice(0, 4).map((task, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400/70 shrink-0" />
                        <span className="truncate">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Progress Bar & Step when Working */}
                {isWorking && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        {progress?.stepDescription || 'Running multi-factor analysis...'}
                      </span>
                      <span className="font-mono text-amber-200 font-bold">{progress?.percent || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${style.progressBar} transition-all duration-300 rounded-full`}
                        style={{ width: `${progress?.percent || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Completed Banner if Finished */}
                {status === 'Completed' && (
                  <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Analysis Completed & Grounded</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px]">Canvas Ready</span>
                  </div>
                )}
              </div>

              {/* Room Bottom Controls */}
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => onOpenAgentConfig(agentId)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Configure
                </button>

                <button
                  onClick={() => onOpenAgentWorkspace(agentId)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    status === 'Completed'
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {status === 'Completed' ? 'Open Dashboard' : 'View Room Suite'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
