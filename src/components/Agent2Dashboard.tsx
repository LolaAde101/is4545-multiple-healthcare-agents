import React, { useState } from 'react';
import {
  Download,
  Search,
  ShieldAlert,
  Users,
  Activity,
  CheckCircle,
  AlertOctagon,
  HeartHandshake,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Agent2ItemResult, Agent2Summary, PatientRecord } from '../types';
import { AgentAvatar } from './AgentAvatar';

interface Agent2DashboardProps {
  results: Agent2ItemResult[];
  summary: Agent2Summary;
  records: PatientRecord[];
}

export const Agent2Dashboard: React.FC<Agent2DashboardProps> = ({ results, summary, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [equityFilter, setEquityFilter] = useState<string>('all');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const recordsMap = new Map(records.map((r) => [r.patient_id, r]));

  const filtered = results.filter((item) => {
    const raw = recordsMap.get(item.patient_id);
    const comment = raw?.patient_comment || '';
    const matchesSearch =
      item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primary_theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operational_bottleneck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.managerial_recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || item.risk_assessment.overall === riskFilter;
    const matchesEquity =
      equityFilter === 'all'
        ? true
        : equityFilter === 'flagged'
        ? item.equity_accessibility_flag.hasConcern
        : item.equity_accessibility_flag.demographicGroup === equityFilter;

    return matchesSearch && matchesRisk && matchesEquity;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ summary, results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agent2_Experience_Equity_Report.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <AgentAvatar agentId="agent-2" status="Completed" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                Room 102
              </span>
              <h2 className="text-xl font-bold text-white">Marcus Reed, MPH</h2>
            </div>
            <p className="text-xs font-semibold text-blue-300">Patient Experience Monitoring Agent</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Systemic health equity auditor and experience analyst specializing in vulnerable cohort protections (Older Adults, LEP, Disabilities, Rural & Low Digital Literacy) and 4-tier organizational risk ratings.
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          Export Agent 2 Findings (JSON)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Cohort Monitored</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{summary.totalAnalyzed}</span>
          <span className="text-[11px] text-blue-400 mt-1 block">Full Multi-Label Evaluation</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Equity Disparities Flagged</span>
          <span className="text-2xl font-bold text-amber-300 font-mono mt-1 block">
            {summary.equityFlagsCount} Cases
          </span>
          <span className="text-[11px] text-amber-400/90 mt-1 block">
            {Math.round((summary.equityFlagsCount / (summary.totalAnalyzed || 1)) * 100)}% of Cohort Impacted
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">High Organizational Risk</span>
          <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
            {summary.highRiskCount} Alerts
          </span>
          <span className="text-[11px] text-rose-300/80 mt-1 block">Safety, Compliance or Equity</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Identified Bottlenecks</span>
          <span className="text-2xl font-bold text-indigo-300 font-mono mt-1 block">
            {summary.bottlenecks.length} Critical Tracks
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Throughput & Scheduling</span>
        </div>
      </div>

      {/* Equity Audit Grid & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-blue-400" />
            Healthcare Equity & Vulnerable Demographics Audit
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(summary.equityBreakdown).map(([demographic, count]) => (
              <div key={demographic} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="font-medium text-slate-200">{demographic}</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px]">
                  {count} Flagged Case{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Matrix */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Systemic Operational Bottlenecks
          </h3>
          <div className="space-y-2 pt-1">
            {summary.bottlenecks.map((b, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2 text-xs">
                <span className="text-slate-200 font-medium leading-relaxed">{b.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                    b.severity === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {b.severity} Risk ({b.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equity, bottlenecks, recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <select
            value={equityFilter}
            onChange={(e) => setEquityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Demographic Groups</option>
            <option value="flagged">Any Equity Disparity Flagged</option>
            {Object.keys(summary.equityBreakdown).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Itemized Analysis Results */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const raw = recordsMap.get(item.patient_id);
          const isExpanded = expandedPatientId === item.patient_id;

          return (
            <div
              key={item.patient_id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-blue-400 text-sm">{item.patient_id}</span>
                  <span className="text-xs text-slate-300 font-medium">{raw?.patient_persona}</span>
                  <span className="text-xs text-slate-500">• {raw?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    Primary: {item.primary_theme}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                      item.risk_assessment.overall === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.risk_assessment.overall === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    Risk: {item.risk_assessment.overall}
                  </span>

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

              {/* 4-Category Risk Heat Breakdown Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Patient Safety:</span>
                  <span className={`font-semibold ${item.risk_assessment.categories.patient_safety === 'High' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {item.risk_assessment.categories.patient_safety}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Compliance:</span>
                  <span className={`font-semibold ${item.risk_assessment.categories.compliance === 'High' ? 'text-amber-400' : 'text-slate-300'}`}>
                    {item.risk_assessment.categories.compliance}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Reputational:</span>
                  <span className={`font-semibold ${item.risk_assessment.categories.reputational === 'High' ? 'text-amber-400' : 'text-slate-300'}`}>
                    {item.risk_assessment.categories.reputational}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Health Equity:</span>
                  <span className={`font-semibold ${item.risk_assessment.categories.equity === 'High' ? 'text-purple-400' : 'text-slate-300'}`}>
                    {item.risk_assessment.categories.equity}
                  </span>
                </div>
              </div>

              {/* Step 2, 3, 5 Deep Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Step 2: Bottleneck */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                    Step 2: Operational Bottleneck
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.operational_bottleneck}</p>
                </div>

                {/* Step 3: Equity Review */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                    Step 3: Equity & Accessibility Review
                  </span>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                      {item.equity_accessibility_flag.demographicGroup}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{item.equity_accessibility_flag.details}</p>
                </div>

                {/* Step 5: Managerial Recommendation */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Step 5: Managerial Recommendation
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.managerial_recommendation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
