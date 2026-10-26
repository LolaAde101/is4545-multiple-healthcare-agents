import React, { useState } from 'react';
import {
  Download,
  Search,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
} from 'lucide-react';
import { Agent4ItemResult, Agent4Summary, PatientRecord } from '../types';
import { AgentAvatar } from './AgentAvatar';

interface Agent4DashboardProps {
  results: Agent4ItemResult[];
  summary: Agent4Summary;
  records: PatientRecord[];
}

export const Agent4Dashboard: React.FC<Agent4DashboardProps> = ({ results, summary, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [humanReviewFilter, setHumanReviewFilter] = useState<string>('all');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const recordsMap = new Map(records.map((r) => [r.patient_id, r]));

  const filtered = results.filter((item) => {
    const raw = recordsMap.get(item.patient_id);
    const comment = raw?.patient_comment || '';
    const matchesSearch =
      item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.main_problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.priority_reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.management_priority === priorityFilter;
    const matchesReview =
      humanReviewFilter === 'all'
        ? true
        : humanReviewFilter === 'needed'
        ? item.human_review_needed
        : !item.human_review_needed;

    return matchesSearch && matchesPriority && matchesReview;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ summary, results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agent4_Hospital_Decision_Support_Report.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-violet-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <AgentAvatar agentId="agent-4" status="Completed" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                Room 104
              </span>
              <h2 className="text-xl font-bold text-white">David Sterling, FACHE</h2>
            </div>
            <p className="text-xs font-semibold text-purple-300">Hospital Manager Decision Support Agent</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Synthesizes patient multidimensional variables, readmission risk, and AI risk flags (Hallucination Traps & Bias) into prioritized managerial decisions and human-in-the-loop governance.
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-purple-400" />
          Export Decision Support (JSON)
        </button>
      </div>

      {/* TOP OF DASHBOARD REQUIREMENT: Most Important Management Alert */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border-2 border-rose-500/60 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Primary Executive Management Alert
              </span>
              <span className="text-xs text-slate-400 font-mono">P1 Priority Alert</span>
            </div>
            <h3 className="text-lg font-bold text-white">{summary.topManagementAlert.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {summary.topManagementAlert.description}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-1.5 md:flex-col md:items-end">
            <span className="text-[11px] text-slate-400">Affected Service Lines:</span>
            <div className="flex flex-wrap gap-1">
              {summary.topManagementAlert.affectedServiceLines.map((sl) => (
                <span key={sl} className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[11px] font-mono border border-slate-700">
                  {sl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Cases Evaluated</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{results.length}</span>
          <span className="text-[11px] text-purple-400 mt-1 block">Full Multi-Variable Matrix</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">High Management Priority</span>
          <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
            {summary.priorityDistribution.High} Cases
          </span>
          <span className="text-[11px] text-rose-300 mt-1 block">Urgent Leadership Intervention</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Mandatory Human Review</span>
          <span className="text-2xl font-bold text-amber-300 font-mono mt-1 block">
            {summary.humanReviewCount} Cases
          </span>
          <span className="text-[11px] text-amber-400/90 mt-1 block">Sign-off Required</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Medium / Low Priority</span>
          <span className="text-2xl font-bold text-teal-300 font-mono mt-1 block">
            {summary.priorityDistribution.Medium + summary.priorityDistribution.Low} Cases
          </span>
          <span className="text-[11px] text-teal-400 mt-1 block">Operational Queues</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems, priority, actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Management Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={humanReviewFilter}
            onChange={(e) => setHumanReviewFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">Human Review: All</option>
            <option value="needed">Human Review Needed Only</option>
            <option value="not_needed">Standard Automation Only</option>
          </select>
        </div>
      </div>

      {/* Itemized Case Analysis Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const raw = recordsMap.get(item.patient_id);
          const isExpanded = expandedPatientId === item.patient_id;

          return (
            <div
              key={item.patient_id}
              className={`p-5 rounded-2xl bg-slate-900/60 border transition-all space-y-4 ${
                item.management_priority === 'High'
                  ? 'border-purple-500/50 hover:border-purple-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-purple-400 text-sm">{item.patient_id}</span>
                  <span className="text-xs text-slate-300 font-medium">{raw?.patient_persona}</span>
                  <span className="text-xs text-slate-500">• {raw?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                      item.management_priority === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.management_priority === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    Priority: {item.management_priority}
                  </span>

                  {item.human_review_needed && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      Human Sign-off
                    </span>
                  )}

                  <button
                    onClick={() => setExpandedPatientId(isExpanded ? null : item.patient_id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Patient quote */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 italic">
                "{raw?.patient_comment}"
              </div>

              {/* Multidimensional Case Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Readmission Risk:</span>
                  <span className={`font-semibold ${raw?.readmission_risk === 'High' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {raw?.readmission_risk}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Follow-Up Compliance:</span>
                  <span className="font-semibold text-slate-300">{raw?.follow_up_compliance}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Patient Portal Usage:</span>
                  <span className="font-semibold text-slate-300 truncate block">{raw?.patient_portal_usage}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">AI Risk Flag:</span>
                  <span className={`font-semibold ${raw?.ai_risk_flags !== 'None' ? 'text-purple-400' : 'text-slate-500'}`}>
                    {raw?.ai_risk_flags}
                  </span>
                </div>
              </div>

              {/* Tasks 1-5 Detailed Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Main Problem & Priority Reasoning */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                      1. Main Problem Identified
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium mt-0.5">{item.main_problem}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      2. Priority Justification
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px] mt-0.5">{item.priority_reasoning}</p>
                  </div>
                </div>

                {/* 3. Recommended Management Actions */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    3. Recommended Management Actions
                  </span>
                  <ul className="space-y-1.5 pt-0.5">
                    {item.recommended_actions.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-200 leading-relaxed">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4 & 5. Human Review & AI Risk Analysis */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      AI Risk Flag & Guardrail Analysis
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px] mt-1">
                      {item.ai_risk_flag_evaluated.analysis}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Human Review Status
                    </span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.human_review_rationale}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM OF DASHBOARD REQUIREMENT: 2-3 Recommended Management Actions */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Consolidated Management Actions Based On Cohort Data
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.strategicActions.map((strat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono text-teal-400 font-bold">Action 0{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    {strat.timeframe}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{strat.action}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-semibold">Expected Impact: </span>
                {strat.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
