import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  FileText,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Agent1ItemResult, Agent1Summary, PatientRecord } from '../types';
import { AgentAvatar } from './AgentAvatar';

interface Agent1DashboardProps {
  results: Agent1ItemResult[];
  summary: Agent1Summary;
  records: PatientRecord[];
}

export const Agent1Dashboard: React.FC<Agent1DashboardProps> = ({ results, summary, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Combine records with results
  const recordsMap = new Map(records.map((r) => [r.patient_id, r]));

  const filtered = results.filter((item) => {
    const raw = recordsMap.get(item.patient_id);
    const comment = raw?.patient_comment || '';
    const matchesSearch =
      item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operational_issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || item.theme === selectedTheme;
    const matchesSentiment = selectedSentiment === 'all' || item.sentiment === selectedSentiment;
    return matchesSearch && matchesTheme && matchesSentiment;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ summary, results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agent1_Feedback_Insight_Report.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Agent Banner & Credentials */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <AgentAvatar agentId="agent-1" status="Completed" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                Room 101
              </span>
              <h2 className="text-xl font-bold text-white">Dr. Evelyn Vance, MD, FACP</h2>
            </div>
            <p className="text-xs font-semibold text-teal-300">Patient Feedback Insight Agent</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Voice-of-patient qualitative analysis mapping unstructured patient narratives into clinical themes, sentiment nuances, root operational issues, and QI managerial interventions.
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          Export Agent 1 Findings (JSON)
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Narratives Analyzed</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{summary.totalAnalyzed}</span>
          <span className="text-[11px] text-teal-400 mt-1 block">100% Extraction Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Sentiment Polarity</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              +{summary.sentimentDistribution['Positive'] || 0} Pos
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              -{summary.sentimentDistribution['Negative'] || 0} Neg
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Identified Themes</span>
          <span className="text-2xl font-bold text-teal-300 font-mono mt-1 block">
            {Object.keys(summary.themeDistribution).length} Categories
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Standard 9-Theme Taxonomy</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Flagged Risk / Bias Concerns</span>
          <span className="text-2xl font-bold text-amber-300 font-mono mt-1 block">
            {summary.flaggedRisksCount} Cases
          </span>
          <span className="text-[11px] text-amber-400/90 mt-1 block">Safety, Bias, or Language</span>
        </div>
      </div>

      {/* Theme Distribution Breakdown & Top Operational Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Themes Bar Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            Theme Classification Distribution
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(summary.themeDistribution).map(([theme, count]) => {
              const pct = Math.round((count / (summary.totalAnalyzed || 1)) * 100);
              return (
                <div key={theme} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{theme}</span>
                    <span className="font-mono text-teal-300">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Operational Bottlenecks */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Top Recurring Healthcare Operational Issues
          </h3>
          <div className="space-y-2.5 pt-1">
            {summary.topOperationalIssues.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-200 font-medium leading-relaxed">{item.issue}</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 shrink-0">
                    {item.count} pt{item.count > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reasoning, issue, comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Primary Themes</option>
            {Object.keys(summary.themeDistribution).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Neutral">Neutral</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Comprehensive Results Table / Card List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const raw = recordsMap.get(item.patient_id);
          const isExpanded = expandedPatientId === item.patient_id;

          return (
            <div
              key={item.patient_id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all space-y-4"
            >
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-teal-400 text-sm">{item.patient_id}</span>
                  <span className="text-xs text-slate-400 font-medium">{raw?.patient_persona}</span>
                  <span className="text-xs text-slate-500">• {raw?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Theme Badge */}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    Theme: {item.theme}
                  </span>

                  {/* Sentiment Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                      item.sentiment === 'Positive'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.sentiment === 'Negative'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.sentiment === 'Mixed'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.sentiment}
                  </span>

                  <button
                    onClick={() => setExpandedPatientId(isExpanded ? null : item.patient_id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Patient Narrative Quote */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 italic">
                "{raw?.patient_comment}"
              </div>

              {/* Steps 3, 4, 5, 6 Detailed Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Step 3: Reasoning */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Step 3: Analytical Reasoning
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.reasoning}</p>
                </div>

                {/* Step 4: Operational Issue */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
                    Step 4: Operational Issue Identified
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.operational_issue}</p>
                </div>

                {/* Step 5: Risk or Bias Concern */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Step 5: Risk or Bias Concern
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.risk_or_bias_concern}</p>
                </div>

                {/* Step 6: Recommended Action */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Step 6: Recommended Managerial Action
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.recommended_action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
