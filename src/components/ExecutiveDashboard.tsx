import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';
import {
  PatientRecord,
  Agent1ItemResult,
  Agent2ItemResult,
  Agent3ItemResult,
  Agent4ItemResult,
  CrossAgentInsight,
  HumanReviewDecision,
} from '../types';

interface ExecutiveDashboardProps {
  records: PatientRecord[];
  agent1Results: Agent1ItemResult[];
  agent2Results: Agent2ItemResult[];
  agent3Results: Agent3ItemResult[];
  agent4Results: Agent4ItemResult[];
  crossInsights: CrossAgentInsight[];
  cSuiteKPIs: {
    totalComments: number;
    avgSatisfaction: number;
    avgCommunication: number;
    followUpComplianceRate: number;
    serviceLinesCount: number;
    highRiskCasesCount: number;
    humanReviewQueueCount: number;
  };
  executivePriorities: string[];
  quickWins: string[];
  longTermAiOpportunities: string[];
  humanReviewDecisions: Record<string, HumanReviewDecision>;
  onSaveHumanDecision: (decision: HumanReviewDecision) => void;
  onNavigateToAgent: (agentId: any) => void;
  analysisTimestamp: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  records,
  agent1Results,
  agent2Results,
  agent3Results,
  agent4Results,
  crossInsights,
  cSuiteKPIs,
  executivePriorities,
  quickWins,
  longTermAiOpportunities,
  humanReviewDecisions,
  onSaveHumanDecision,
  onNavigateToAgent,
  analysisTimestamp,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'consensus' | 'reviewQueue' | 'csuite'>('overview');
  const [selectedCaseForReview, setSelectedCaseForReview] = useState<CrossAgentInsight | null>(null);
  const [reviewerName, setReviewerName] = useState('Dr. Marcus Vance, Chief Medical Officer');
  const [reviewerRole, setReviewerRole] = useState('Hospital Executive & Quality Committee');
  const [reviewStatus, setReviewStatus] = useState<'Approved' | 'Modified' | 'Rejected' | 'Escalated' | 'Pending'>('Approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewActionTaken, setReviewActionTaken] = useState('');

  const recordsMap = new Map(records.map((r) => [r.patient_id, r]));

  // Open review modal for a specific case
  const openReviewModal = (insight: CrossAgentInsight) => {
    setSelectedCaseForReview(insight);
    const existing = humanReviewDecisions[insight.patient_id];
    if (existing) {
      setReviewerName(existing.reviewedBy);
      setReviewerRole(existing.role);
      setReviewStatus(existing.status);
      setReviewNotes(existing.clinicalNotes);
      setReviewActionTaken(existing.actionTaken);
    } else {
      setReviewNotes('');
      setReviewActionTaken(insight.recommended_followup || '');
      setReviewStatus('Approved');
    }
  };

  const handleSaveReview = () => {
    if (!selectedCaseForReview) return;
    const decision: HumanReviewDecision = {
      id: `REV-${Date.now()}`,
      patient_id: selectedCaseForReview.patient_id,
      reviewedBy: reviewerName,
      role: reviewerRole,
      status: reviewStatus,
      clinicalNotes: reviewNotes || 'Reviewed and validated clinical and operational mitigation plan.',
      actionTaken: reviewActionTaken || selectedCaseForReview.recommended_followup,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    };
    onSaveHumanDecision(decision);
    setSelectedCaseForReview(null);
  };

  const exportFullExecutiveBrief = () => {
    const brief = {
      title: 'Executive Healthcare Clinical Quality & Multi-Agent Operations Brief',
      timestamp: analysisTimestamp,
      kpis: cSuiteKPIs,
      priorities: executivePriorities,
      quickWins,
      longTermAiOpportunities,
      crossAgentInsights: crossInsights,
      humanReviewDecisions,
    };
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexHealth_Executive_AI_Brief_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-teal-950/40 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-semibold border border-teal-500/30">
              C-Suite Executive Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">Completed: {analysisTimestamp}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Combined Executive Dashboard & Responsible AI Governance
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidates parallel outputs from all four AI agents, identifies multi-agent consensus, surfaces conflicting interpretations (such as NLP hallucination traps), and enforces human sign-offs before leadership actions are finalized.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print Brief
          </button>
          <button
            onClick={exportFullExecutiveBrief}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Export Executive Brief (JSON)
          </button>
        </div>
      </div>

      {/* Mandatory Responsible Use Legal & Clinical Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 block">Responsible AI & Human-in-the-Loop Governance Mandate:</span>
          <p className="leading-relaxed text-slate-400">
            These specialized AI agents support clinical operations, quality improvement, and management decision-making. In accordance with healthcare governance policies, AI outputs do not independently make clinical diagnoses, treatment decisions, patient discharge clearances, employment decisions, or final compliance determinations. Final mitigation actions must be confirmed by an authorized human reviewer.
          </p>
        </div>
      </div>

      {/* Section 1: Executive C-Suite KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Cohort Volume</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{cSuiteKPIs.totalComments}</span>
          <span className="text-[10px] text-teal-400 block mt-0.5">100% Processed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Avg Satisfaction</span>
          <span className="text-2xl font-bold text-sky-400 font-mono mt-1 block">
            {cSuiteKPIs.avgSatisfaction} <span className="text-xs text-slate-500">/ 5.0</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">CSAT Benchmark</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Communication</span>
          <span className="text-2xl font-bold text-teal-300 font-mono mt-1 block">
            {cSuiteKPIs.avgCommunication} <span className="text-xs text-slate-500">/ 5.0</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Doctor & Nurse Rating</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Follow-Up Compliance</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
            {cSuiteKPIs.followUpComplianceRate}%
          </span>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">Post-Discharge Adherence</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Service Lines</span>
          <span className="text-2xl font-bold text-indigo-300 font-mono mt-1 block">
            {cSuiteKPIs.serviceLinesCount} Depts
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Inpatient & Ambulatory</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/40 bg-rose-950/20">
          <span className="text-[11px] text-rose-300 block font-medium">Human Review Queue</span>
          <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
            {cSuiteKPIs.humanReviewQueueCount}
          </span>
          <span className="text-[10px] text-rose-300/80 block mt-0.5">
            {Object.keys(humanReviewDecisions).length} Signed Off
          </span>
        </div>
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSection('overview')}
          className={`pb-3 px-1 transition-colors border-b-2 ${
            activeSection === 'overview'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Cross-Agent Consensus & Conflict Insights ({crossInsights.length})
        </button>

        <button
          onClick={() => setActiveSection('reviewQueue')}
          className={`pb-3 px-1 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeSection === 'reviewQueue'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Mandatory Human Review Queue ({cSuiteKPIs.humanReviewQueueCount})
        </button>

        <button
          onClick={() => setActiveSection('csuite')}
          className={`pb-3 px-1 transition-colors border-b-2 ${
            activeSection === 'csuite'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          C-Suite Strategic Priorities & AI Roadmap
        </button>
      </div>

      {/* TAB 1: CROSS-AGENT SYNTHESIS & CONFLICTS */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Comparing outputs across <strong className="text-teal-400">Agent 1</strong> (Insight),{' '}
              <strong className="text-blue-400">Agent 2</strong> (Experience & Equity),{' '}
              <strong className="text-rose-400">Agent 3</strong> (Triage), and{' '}
              <strong className="text-purple-400">Agent 4</strong> (Management Decision Support).
            </span>
            <span className="font-mono text-teal-300 text-[11px] bg-slate-800 px-2.5 py-1 rounded-lg">
              Synthesis Engine Active
            </span>
          </div>

          <div className="space-y-4">
            {crossInsights.map((insight) => {
              const raw = recordsMap.get(insight.patient_id);
              const decision = humanReviewDecisions[insight.patient_id];

              return (
                <div
                  key={insight.patient_id}
                  className={`p-5 rounded-3xl bg-slate-900/60 border transition-all space-y-4 ${
                    insight.urgency === 'Critical'
                      ? 'border-rose-500/50 hover:border-rose-400'
                      : insight.urgency === 'Elevated'
                      ? 'border-amber-500/50 hover:border-amber-400'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-teal-400 text-sm">{insight.patient_id}</span>
                      <span className="text-xs font-semibold text-white">{insight.summary_topic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          insight.urgency === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : insight.urgency === 'Elevated'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Urgency: {insight.urgency}
                      </span>

                      {decision ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Signed Off ({decision.status})
                        </span>
                      ) : insight.requires_human_signoff ? (
                        <button
                          onClick={() => openReviewModal(insight)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                          Review & Sign-off
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Automated Pipeline</span>
                      )}
                    </div>
                  </div>

                  {/* Patient narrative quote */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 italic">
                    "{raw?.patient_comment}"
                  </div>

                  {/* Consensual Findings Across Multiple Agents */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                      Cross-Agent Corroborated Findings:
                    </span>
                    <div className="space-y-1">
                      {insight.consensual_findings.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conflicting Interpretations / Hallucination Trap Check */}
                  {insight.conflicting_interpretations && (
                    <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Conflicting Interpretation / NLP Safeguard Alert
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-amber-200">Nuance Identified: </strong>
                        {insight.conflicting_interpretations.difference}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-slate-400 block font-semibold">Standard Keyword Matcher:</span>
                          <span className="text-slate-300">{insight.conflicting_interpretations.agentA}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-purple-300 block font-semibold">Contextual Hospital Decision Agent:</span>
                          <span className="text-slate-300">{insight.conflicting_interpretations.agentB}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Follow-up */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 leading-relaxed">
                        <strong className="text-white">Recommended Next Action: </strong>
                        {insight.recommended_followup}
                      </span>
                    </div>

                    {insight.requires_human_signoff && !decision && (
                      <button
                        onClick={() => openReviewModal(insight)}
                        className="text-amber-300 hover:text-amber-200 font-semibold text-xs whitespace-nowrap"
                      >
                        Sign-off required &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MANDATORY HUMAN REVIEW QUEUE */}
      {activeSection === 'reviewQueue' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm mb-1">Human-in-the-Loop Clinical & Compliance Sign-Off Queue</h3>
            <p className="text-slate-400">
              Healthcare leadership review checkpoint. These high-risk cases contain potential medication safety events, language access barriers, HIPAA disclosure risks, or algorithmic hallucination traps. A qualified professional must sign off before clinical or managerial actions are executed.
            </p>
          </div>

          <div className="space-y-4">
            {crossInsights
              .filter((i) => i.requires_human_signoff)
              .map((insight) => {
                const raw = recordsMap.get(insight.patient_id);
                const decision = humanReviewDecisions[insight.patient_id];

                return (
                  <div
                    key={insight.patient_id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-400 text-sm">{insight.patient_id}</span>
                          <span className="font-semibold text-white text-xs">{raw?.patient_persona}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{raw?.service_line} • {raw?.visit_type}</span>
                      </div>

                      <div>
                        {decision ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Status: {decision.status}
                            </span>
                            <button
                              onClick={() => openReviewModal(insight)}
                              className="text-xs text-slate-400 hover:text-white underline"
                            >
                              Edit Decision
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openReviewModal(insight)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                            Perform Review & Sign-off
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 italic">
                      "{raw?.patient_comment}"
                    </div>

                    {decision && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>
                            Approved By: <strong className="text-white">{decision.reviewedBy}</strong> ({decision.role})
                          </span>
                          <span className="font-mono text-emerald-400">{decision.timestamp}</span>
                        </div>
                        <p className="text-slate-200 mt-1">
                          <strong className="text-teal-300">Action Committed: </strong>
                          {decision.actionTaken}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          <strong>Clinical Notes: </strong>
                          {decision.clinicalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: C-SUITE STRATEGIC RECOMMENDATIONS & AI ROADMAP */}
      {activeSection === 'csuite' && (
        <div className="space-y-6">
          {/* Top 5 Priorities */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              Top 5 Hospital Leadership Priorities
            </h3>
            <div className="space-y-2">
              {executivePriorities.map((pri, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
                  {pri}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Wins (within 3 months) */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-sky-400" />
                Quick Operational Wins (Within 90 Days)
              </h3>
              <div className="space-y-2">
                {quickWins.map((qw, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="font-mono text-sky-400 font-bold shrink-0">W0{idx + 1}</span>
                    <span>{qw}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-Term AI Opportunities (6-12 months) */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Long-Term Enterprise AI Roadmap (6–12 Months)
              </h3>
              <div className="space-y-2">
                {longTermAiOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="font-mono text-purple-400 font-bold shrink-0">AI-0{idx + 1}</span>
                    <span>{opp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Human Review Checkpoint Modal */}
      {selectedCaseForReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Human Clinical & Administrative Sign-off
                </h3>
              </div>
              <span className="font-mono text-xs text-teal-400 px-2 py-0.5 rounded bg-slate-800">
                {selectedCaseForReview.patient_id}
              </span>
            </div>

            {/* Clear distinction between AI observation vs human decision */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Supporting Patient Evidence (Unedited Narrative)
                </span>
                <p className="italic text-slate-300">
                  "{recordsMap.get(selectedCaseForReview.patient_id)?.patient_comment}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block mb-1">
                  AI-Generated Multi-Agent Recommendation
                </span>
                <p className="text-slate-200">{selectedCaseForReview.recommended_followup}</p>
              </div>
            </div>

            {/* Human Sign-off Form */}
            <div className="space-y-4 pt-2 border-t border-slate-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Authorized Reviewer Name:</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Clinical Leadership Role:</label>
                  <input
                    type="text"
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Executive Decision:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Approved', 'Modified', 'Escalated', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewStatus(st)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        reviewStatus === st
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Committed Operational Mitigation Action:</label>
                <input
                  type="text"
                  value={reviewActionTaken}
                  onChange={(e) => setReviewActionTaken(e.target.value)}
                  placeholder="Specify immediate clinical action taken..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Clinical Justification Notes:</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter supervisory notes for audit trail..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCaseForReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReview}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/20 transition-all"
              >
                Sign & Finalize Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
