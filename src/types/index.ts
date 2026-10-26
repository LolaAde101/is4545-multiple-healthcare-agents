export type AgentId = 'agent-1' | 'agent-2' | 'agent-3' | 'agent-4';

export type AgentStatus = 'Idle' | 'Selected' | 'Processing' | 'Completed' | 'Error';

export interface PatientRecord {
  patient_id: string;
  patient_persona: string;
  age_group: string;
  visit_type: string;
  service_line: string;
  patient_satisfaction: number; // 1 - 5
  communication_rating: number; // 1 - 5
  follow_up_compliance: 'Compliant' | 'Non-Compliant' | 'Partial';
  complaint_severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  patient_portal_usage: 'Daily' | 'Occasional' | 'Never / Unable to Access' | 'Blocked / Error';
  readmission_risk: 'Low' | 'Medium' | 'High';
  ai_risk_flags: 'None' | 'Hallucination Risk' | 'Bias Review' | 'Human Review Required' | 'Linguistic Barrier';
  patient_comment: string;
}

// Agent 1: Patient Feedback Insight Agent
export interface Agent1ItemResult {
  patient_id: string;
  theme: 'Communication' | 'Scheduling' | 'Wait Time' | 'Technology / Patient Portal' | 'Billing' | 'Clinical Care' | 'Discharge / Follow-Up' | 'Accessibility / Equity' | 'Mixed or Ambiguous';
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operational_issue: string;
  risk_or_bias_concern: string;
  recommended_action: string;
}

export interface Agent1Summary {
  totalAnalyzed: number;
  sentimentDistribution: Record<string, number>;
  themeDistribution: Record<string, number>;
  topOperationalIssues: { issue: string; count: number }[];
  flaggedRisksCount: number;
}

// Agent 2: Patient Experience Monitoring Agent
export interface Agent2ItemResult {
  patient_id: string;
  primary_theme: string;
  secondary_themes: string[];
  operational_bottleneck: string;
  equity_accessibility_flag: {
    hasConcern: boolean;
    demographicGroup: 'Older adults' | 'Rural patients' | 'Disabilities' | 'Limited English proficiency' | 'Low digital literacy' | 'None';
    details: string;
  };
  risk_assessment: {
    overall: 'Low' | 'Moderate' | 'High';
    categories: {
      patient_safety: 'Low' | 'Moderate' | 'High';
      reputational: 'Low' | 'Moderate' | 'High';
      compliance: 'Low' | 'Moderate' | 'High';
      equity: 'Low' | 'Moderate' | 'High';
    };
    rationale: string;
  };
  managerial_recommendation: string;
}

export interface Agent2Summary {
  totalAnalyzed: number;
  equityFlagsCount: number;
  highRiskCount: number;
  bottlenecks: { name: string; severity: 'High' | 'Moderate' | 'Low'; count: number }[];
  equityBreakdown: Record<string, number>;
}

// Agent 3: Complaint Triage Assistant
export type SeverityLevel = 'LEVEL 1 - Low' | 'LEVEL 2 - Moderate' | 'LEVEL 3 - High' | 'LEVEL 4 - Critical';

export type EscalationDestination =
  | 'Patient Experience Team'
  | 'Nursing Leadership'
  | 'Physician Leadership'
  | 'Quality Improvement Team'
  | 'Compliance Office'
  | 'Information Technology'
  | 'Revenue Cycle / Billing'
  | 'Accessibility Coordinator'
  | 'Risk Management'
  | 'Executive Review';

export interface Agent3ItemResult {
  patient_id: string;
  primary_category: string;
  secondary_categories: string[];
  severity_level: SeverityLevel;
  severity_reasoning: string;
  flagged_risks: {
    riskType: 'Patient Safety Risk' | 'Clinical Risk' | 'Compliance Risk' | 'Privacy Risk' | 'Accessibility Risk' | 'Equity Risk' | 'Reputational Risk' | 'Operational Risk';
    explanation: string;
  }[];
  escalation_target: EscalationDestination;
  requires_human_intervention: boolean;
  target_turnaround_hours: number;
}

export interface Agent3Summary {
  totalTriaged: number;
  severityDistribution: Record<SeverityLevel, number>;
  destinationDistribution: Record<string, number>;
  humanInterventionRequiredCount: number;
  topRiskCategories: { category: string; count: number }[];
}

// Agent 4: Hospital Manager Decision Support Agent
export interface Agent4ItemResult {
  patient_id: string;
  main_problem: string;
  management_priority: 'Low' | 'Medium' | 'High';
  priority_reasoning: string;
  recommended_actions: string[];
  human_review_needed: boolean;
  human_review_rationale: string;
  ai_risk_flag_evaluated: {
    flag: string;
    analysis: string;
  };
}

export interface Agent4Summary {
  topManagementAlert: {
    title: string;
    description: string;
    severity: 'High' | 'Medium';
    affectedServiceLines: string[];
  };
  priorityDistribution: Record<'High' | 'Medium' | 'Low', number>;
  humanReviewCount: number;
  strategicActions: {
    action: string;
    timeframe: 'Immediate' | '30 Days' | '90 Days';
    impact: string;
  }[];
}

// Cross-Agent & Executive Synthesis
export interface CrossAgentInsight {
  patient_id: string;
  summary_topic: string;
  consensual_findings: string[];
  conflicting_interpretations?: {
    agentA: string;
    agentB: string;
    difference: string;
  };
  urgency: 'Critical' | 'Elevated' | 'Standard';
  requires_human_signoff: boolean;
  recommended_followup: string;
}

export interface HumanReviewDecision {
  id: string;
  patient_id: string;
  reviewedBy: string;
  role: string;
  status: 'Pending' | 'Approved' | 'Modified' | 'Rejected' | 'Escalated';
  clinicalNotes: string;
  actionTaken: string;
  timestamp: string;
}

export interface AgentMetadata {
  id: AgentId;
  roomNumber: string;
  roomName: string;
  name: string;
  role: string;
  credentials: string;
  avatarSeed: string;
  avatarBg: string;
  avatarAccent: string;
  specialty: string;
  description: string;
  tasksList: string[];
  currentStepDescription?: string;
}
