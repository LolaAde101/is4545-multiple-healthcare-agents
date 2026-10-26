import React from 'react';
import {
  Activity,
  Layers,
  UploadCloud,
  Cpu,
  FileCheck2,
  Play,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { AgentId, AgentStatus } from '../types';

export type ScreenTab = 'office' | 'data' | 'processing' | 'results' | 'executive';

interface HeaderProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  selectedAgentIds: Set<AgentId>;
  agentStatuses: Record<AgentId, AgentStatus>;
  onStartAnalysis: () => void;
  onResetData: () => void;
  isProcessingAny: boolean;
  datasetName: string;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  selectedAgentIds,
  agentStatuses,
  onStartAnalysis,
  onResetData,
  isProcessingAny,
  datasetName,
  totalRecordsCount,
}) => {
  const completedCount = Object.values(agentStatuses).filter((s) => s === 'Completed').length;
  const processingCount = Object.values(agentStatuses).filter((s) => s === 'Processing').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="font-semibold text-teal-300">CLINICAL VIRTUAL-OFFICE GOVERNANCE:</span>
          <span className="text-slate-400">
            Prototypes analyze de-identified/synthetic patient data. AI provides operational decision support; human review is required for clinical and compliance actions.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            EHR Mock Proxy: Connected
          </span>
          <span className="text-slate-500">System v2.4</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('office')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                ApexHealth <span className="text-teal-400 font-medium">Virtual-Office</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 text-[10px] font-semibold tracking-wide border border-teal-500/30 uppercase">
                4 Clinical Agents
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Parallel Multi-Agent Clinical Triage, Experience Analytics & Hospital Decision Support
            </p>
          </div>
        </div>

        {/* Global Controls & Dataset Status */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Active Cohort:</span>
            <span className="font-medium text-slate-200 truncate max-w-[170px]" title={datasetName}>
              {datasetName}
            </span>
            <span className="bg-slate-800 px-1.5 py-0.2 rounded text-[11px] text-teal-300 font-mono">
              {totalRecordsCount} pts
            </span>
          </div>

          <button
            onClick={onStartAnalysis}
            disabled={isProcessingAny || selectedAgentIds.size === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${
              isProcessingAny
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed'
                : selectedAgentIds.size === 0
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white shadow-teal-500/25 active:scale-95'
            }`}
          >
            {isProcessingAny ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                Agents Working ({processingCount}/4)...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run {selectedAgentIds.size} Selected Agent{selectedAgentIds.size > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          <button
            onClick={() => onSelectTab('office')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'office'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            1. Virtual Office (4 Rooms)
          </button>

          <button
            onClick={() => onSelectTab('data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'data'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
            2. Data & Config
          </button>

          <button
            onClick={() => onSelectTab('processing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
              currentTab === 'processing'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            3. Live Processing
            {isProcessingAny && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 right-1" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('results')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'results'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            4. Agent Results Dashboards
            {completedCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono border border-emerald-500/40">
                {completedCount}/4
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('executive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'executive'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            5. Executive Summary & Review
          </button>
        </nav>

        {/* Quick completed status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-4">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Completed: {completedCount} of 4 Agents</span>
        </div>
      </div>
    </header>
  );
};
