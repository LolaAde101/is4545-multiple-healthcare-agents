import React, { useState } from 'react';
import {
  Download,
  Search,
  AlertTriangle,
  Clock,
  Send,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  Building,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Agent3ItemResult, Agent3Summary, PatientRecord, SeverityLevel } from '../types';
import { AgentAvatar } from './AgentAvatar';

interface Agent3DashboardProps {
  results: Agent3ItemResult[];
  summary: Agent3Summary;
  records: PatientRecord[];
}

export const Agent3Dashboard: React.FC<Agent3DashboardProps> = ({ results, summary, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [onlyHumanIntervention, setOnlyHumanIntervention] = useState(false);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const recordsMap = new Map(records.map((r) => [r.patient_id, r]));

  const filtered = results.filter((item) => {
    const raw = recordsMap.get(item.patient_id);
    const comment = raw?.patient_comment || '';
    const matchesSearch =
      item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primary_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.severity_reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.escalation_target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || item.severity_level === selectedSeverity;
    const matchesDestination = selectedDestination === 'all' || item.escalation_target === selectedDestination;
    const matchesHuman = !onlyHumanIntervention || item.requires_human_intervention;

    return matchesSearch && matchesSeverity && matchesDestination && matchesHuman;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ summary, results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agent3_Complaint_Triage_Report.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-pink-950/40 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <AgentAvatar agentId="agent-3" status="Completed" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                Room 103
              </span>
              <h2 className="text-xl font-bold text-white">Sarah Lin, RN, BSN, CPHQ</h2>
            </div>
            <p className="text-xs font-semibold text-rose-300">Healthcare Complaint Triage Assistant</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Standardized grievance triage engine classifying clinical severity (Level 1 Low to Level 4 Critical), identifying multi-category clinical/compliance risks, and routing cases to 10 hospital governing departments with SLA benchmarks.
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-rose-400" />
          Export Agent 3 Triage Data (JSON)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Triaged Grievances</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{summary.totalTriaged}</span>
          <span className="text-[11px] text-rose-400 mt-1 block">Full Severity Scoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Level 4 - Critical Cases</span>
          <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
            {summary.severityDistribution['LEVEL 4 - Critical'] || 0} Cases
          </span>
          <span className="text-[11px] text-rose-300 mt-1 block">&lt; 4-Hour Response SLA</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Mandatory Human Triage</span>
          <span className="text-2xl font-bold text-amber-300 font-mono mt-1 block">
            {summary.humanInterventionRequiredCount} Cases
          </span>
          <span className="text-[11px] text-amber-400/90 mt-1 block">Human Oversight Mandated</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Active Routing Units</span>
          <span className="text-2xl font-bold text-teal-300 font-mono mt-1 block">
            {Object.keys(summary.destinationDistribution).length} Departments
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">10 Target Clinical Units</span>
        </div>
      </div>

      {/* Severity Breakdown & Department Escalation Routing Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Clinical Severity Level Breakdown
          </h3>
          <div className="space-y-2 pt-1">
            {(
              [
                'LEVEL 4 - Critical',
                'LEVEL 3 - High',
                'LEVEL 2 - Moderate',
                'LEVEL 1 - Low',
              ] as SeverityLevel[]
            ).map((lvl) => {
              const count = summary.severityDistribution[lvl] || 0;
              const pct = Math.round((count / (summary.totalTriaged || 1)) * 100);
              const color =
                lvl.startsWith('LEVEL 4')
                  ? 'bg-rose-500'
                  : lvl.startsWith('LEVEL 3')
                  ? 'bg-amber-500'
                  : lvl.startsWith('LEVEL 2')
                  ? 'bg-sky-500'
                  : 'bg-emerald-500';

              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold">{lvl}</span>
                    <span className="font-mono text-slate-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escalation Destinations */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-400" />
            Assigned Escalation Routing Targets
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(summary.destinationDistribution).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium text-slate-200 truncate">{dept}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] shrink-0">
                  {count} Case{count > 1 ? 's' : ''}
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
            placeholder="Search severity, destination, comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Severity Levels</option>
            <option value="LEVEL 4 - Critical">Level 4 - Critical</option>
            <option value="LEVEL 3 - High">Level 3 - High</option>
            <option value="LEVEL 2 - Moderate">Level 2 - Moderate</option>
            <option value="LEVEL 1 - Low">Level 1 - Low</option>
          </select>

          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Escalation Units</option>
            {Object.keys(summary.destinationDistribution).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-xs text-amber-300 font-medium cursor-pointer ml-1 select-none">
            <input
              type="checkbox"
              checked={onlyHumanIntervention}
              onChange={(e) => setOnlyHumanIntervention(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-rose-500 bg-slate-800"
            />
            <span>Human Review Required Only</span>
          </label>
        </div>
      </div>

      {/* Detailed Triage Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const raw = recordsMap.get(item.patient_id);
          const isExpanded = expandedPatientId === item.patient_id;

          return (
            <div
              key={item.patient_id}
              className={`p-5 rounded-2xl bg-slate-900/60 border transition-all space-y-4 ${
                item.severity_level.startsWith('LEVEL 4')
                  ? 'border-rose-500/50 hover:border-rose-400'
                  : item.severity_level.startsWith('LEVEL 3')
                  ? 'border-amber-500/50 hover:border-amber-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-rose-400 text-sm">{item.patient_id}</span>
                  <span className="text-xs text-slate-300 font-medium">{raw?.patient_persona}</span>
                  <span className="text-xs text-slate-500">• {raw?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                      item.severity_level.startsWith('LEVEL 4')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : item.severity_level.startsWith('LEVEL 3')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : item.severity_level.startsWith('LEVEL 2')
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {item.severity_level}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-teal-300 border border-slate-700 flex items-center gap-1.5">
                    <Send className="w-3 h-3 text-teal-400" />
                    Route: {item.escalation_target}
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

              {/* Triage Details & SLA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Step 2: Severity Reasoning */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                    Step 2: Severity Assessment Reasoning
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.severity_reasoning}</p>
                </div>

                {/* Step 3: Flagged Risks (8-category) */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                    Step 3: Applicable Risk Detections
                  </span>
                  <div className="space-y-1.5">
                    {item.flagged_risks.map((fr, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <span className="font-semibold text-amber-300 block">{fr.riskType}</span>
                        <span className="text-slate-400">{fr.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 4: Routing & SLA Governance */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                    Step 4: Escalation SLA & Governance
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Target Response Turnaround:</span>
                      <span className="font-mono text-teal-300 font-bold">{item.target_turnaround_hours} Hours</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Human Intervention Required:</span>
                      <span className={`font-semibold ${item.requires_human_intervention ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {item.requires_human_intervention ? 'YES (Mandatory)' : 'NO (Automated)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
