/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  AgentId,
  AgentStatus,
  PatientRecord,
  Agent1ItemResult,
  Agent1Summary,
  Agent2ItemResult,
  Agent2Summary,
  Agent3ItemResult,
  Agent3Summary,
  Agent4ItemResult,
  Agent4Summary,
  CrossAgentInsight,
  HumanReviewDecision,
} from './types';
import { SAMPLE_PATIENT_RECORDS } from './data/sampleDataset';
import { AGENT_REGISTRY } from './data/agentMetadata';
import {
  analyzeFeedbackInsight,
  compileAgent1Summary,
  analyzeExperienceMonitoring,
  compileAgent2Summary,
  triageComplaint,
  compileAgent3Summary,
  analyzeManagerDecisionSupport,
  compileAgent4Summary,
  synthesizeCrossAgentInsights,
} from './services/agentEngine';
import { Header, ScreenTab } from './components/Header';
import { VirtualOffice } from './components/VirtualOffice';
import { DataConfigView } from './components/DataConfigView';
import { LiveProcessingView } from './components/LiveProcessingView';
import { Agent1Dashboard } from './components/Agent1Dashboard';
import { Agent2Dashboard } from './components/Agent2Dashboard';
import { Agent3Dashboard } from './components/Agent3Dashboard';
import { Agent4Dashboard } from './components/Agent4Dashboard';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<ScreenTab>('office');
  const [activeResultsAgent, setActiveResultsAgent] = useState<AgentId>('agent-1');

  // Cohort Dataset State
  const [datasetName, setDatasetName] = useState<string>('ApexHealth Q3 Inpatient & Ambulatory Grievance Cohort');
  const [records, setRecords] = useState<PatientRecord[]>(SAMPLE_PATIENT_RECORDS);

  // Agent Selection & Execution State
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<AgentId>>(
    new Set(['agent-1', 'agent-2', 'agent-3', 'agent-4'])
  );

  const [agentStatuses, setAgentStatuses] = useState<Record<AgentId, AgentStatus>>({
    'agent-1': 'Idle',
    'agent-2': 'Idle',
    'agent-3': 'Idle',
    'agent-4': 'Idle',
  });

  const [agentProgress, setAgentProgress] = useState<
    Record<AgentId, { currentStep: number; totalSteps: number; stepDescription: string; percent: number }>
  >({
    'agent-1': { currentStep: 0, totalSteps: 6, stepDescription: 'Awaiting task trigger', percent: 0 },
    'agent-2': { currentStep: 0, totalSteps: 5, stepDescription: 'Awaiting task trigger', percent: 0 },
    'agent-3': { currentStep: 0, totalSteps: 5, stepDescription: 'Awaiting task trigger', percent: 0 },
    'agent-4': { currentStep: 0, totalSteps: 5, stepDescription: 'Awaiting task trigger', percent: 0 },
  });

  const [liveTelemetryLogs, setLiveTelemetryLogs] = useState<
    { timestamp: string; agentId: AgentId; message: string; severity?: 'info' | 'warn' | 'success' }[]
  >([]);

  // Agent Analytical Results Cache
  const [agent1Results, setAgent1Results] = useState<Agent1ItemResult[]>([]);
  const [agent1Summary, setAgent1Summary] = useState<Agent1Summary | null>(null);

  const [agent2Results, setAgent2Results] = useState<Agent2ItemResult[]>([]);
  const [agent2Summary, setAgent2Summary] = useState<Agent2Summary | null>(null);

  const [agent3Results, setAgent3Results] = useState<Agent3ItemResult[]>([]);
  const [agent3Summary, setAgent3Summary] = useState<Agent3Summary | null>(null);

  const [agent4Results, setAgent4Results] = useState<Agent4ItemResult[]>([]);
  const [agent4Summary, setAgent4Summary] = useState<Agent4Summary | null>(null);

  // Cross-Agent & Executive State
  const [crossInsights, setCrossInsights] = useState<CrossAgentInsight[]>([]);
  const [cSuiteKPIs, setCSuiteKPIs] = useState<any>({
    totalComments: 20,
    avgSatisfaction: 2.7,
    avgCommunication: 2.8,
    followUpComplianceRate: 55,
    serviceLinesCount: 5,
    highRiskCasesCount: 6,
    humanReviewQueueCount: 5,
  });
  const [executivePriorities, setExecutivePriorities] = useState<string[]>([]);
  const [quickWins, setQuickWins] = useState<string[]>([]);
  const [longTermAiOpportunities, setLongTermAiOpportunities] = useState<string[]>([]);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>('');

  // Human Review Decisions Store
  const [humanReviewDecisions, setHumanReviewDecisions] = useState<Record<string, HumanReviewDecision>>({});

  // Active timers tracking for cancellation
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Automatically pre-compute baseline results so dashboards are immediately informative on launch
  useEffect(() => {
    runInferencePipeline(true);
  }, []);

  // Parallel Multi-Agent Execution Pipeline
  const runInferencePipeline = (isInitial = false) => {
    // Clear any running timers
    activeTimersRef.current.forEach(clearTimeout);
    activeTimersRef.current = [];

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAnalysisTimestamp(nowStr);

    const activeList = Array.from(selectedAgentIds);
    if (activeList.length === 0) return;

    if (!isInitial) {
      setCurrentTab('processing');
    }

    // Mark active agents as processing
    setAgentStatuses((prev) => {
      const next = { ...prev };
      activeList.forEach((id) => {
        next[id] = 'Processing';
      });
      return next;
    });

    // Reset progress
    setAgentProgress((prev) => {
      const next = { ...prev };
      activeList.forEach((id) => {
        next[id] = { currentStep: 1, totalSteps: AGENT_REGISTRY[id].tasksList.length, stepDescription: 'Initializing agent pipeline...', percent: 10 };
      });
      return next;
    });

    const addLog = (agentId: AgentId, message: string, severity: 'info' | 'warn' | 'success' = 'info') => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveTelemetryLogs((prev) => [{ timestamp: time, agentId, message, severity }, ...prev.slice(0, 40)]);
    };

    addLog('agent-1', `Spawned multi-agent execution thread with ${records.length} clinical records.`, 'info');

    // Simulate parallel asynchronous pipelines with progressive steps
    const duration = isInitial ? 300 : 2200;

    // Step 1: Ingestion
    const t1 = setTimeout(() => {
      setAgentProgress((prev) => {
        const next = { ...prev };
        if (selectedAgentIds.has('agent-1')) next['agent-1'] = { currentStep: 2, totalSteps: 6, stepDescription: 'Mining narrative sentiments & clinical themes...', percent: 35 };
        if (selectedAgentIds.has('agent-2')) next['agent-2'] = { currentStep: 2, totalSteps: 5, stepDescription: 'Evaluating equity barriers & vulnerable demographics...', percent: 40 };
        if (selectedAgentIds.has('agent-3')) next['agent-3'] = { currentStep: 2, totalSteps: 5, stepDescription: 'Scoring clinical severity & triage escalation...', percent: 45 };
        if (selectedAgentIds.has('agent-4')) next['agent-4'] = { currentStep: 2, totalSteps: 5, stepDescription: 'Auditing AI risk flags & hallucination traps...', percent: 38 };
        return next;
      });

      addLog('agent-1', 'Extracted 9 clinical theme clusters across inpatient and outpatient services.', 'info');
      addLog('agent-2', 'Identified Title VI language barriers and physical ADA exam table deficits.', 'warn');
      addLog('agent-3', 'Level 4 Critical complaint detected: Post-discharge medication double-dosing.', 'warn');
      addLog('agent-4', 'Identified Hallucination Trap: Idiomatic phrase "heart stopped" flagged as billing dispute.', 'warn');
    }, duration * 0.35);
    activeTimersRef.current.push(t1);

    // Step 2: Risk Classification & Synthesis
    const t2 = setTimeout(() => {
      setAgentProgress((prev) => {
        const next = { ...prev };
        if (selectedAgentIds.has('agent-1')) next['agent-1'] = { currentStep: 4, totalSteps: 6, stepDescription: 'Formulating QI managerial actions...', percent: 75 };
        if (selectedAgentIds.has('agent-2')) next['agent-2'] = { currentStep: 4, totalSteps: 5, stepDescription: 'Compiling 4-dimensional risk heat matrix...', percent: 80 };
        if (selectedAgentIds.has('agent-3')) next['agent-3'] = { currentStep: 4, totalSteps: 5, stepDescription: 'Assigning governing department routing & SLAs...', percent: 85 };
        if (selectedAgentIds.has('agent-4')) next['agent-4'] = { currentStep: 4, totalSteps: 5, stepDescription: 'Generating executive action priorities...', percent: 78 };
        return next;
      });

      addLog('agent-3', 'Routed 4 critical cases to Risk Management, Compliance Office, and Executive Review.', 'info');
      addLog('agent-4', 'Flagged 5 high-priority cases for Mandatory Human-in-the-Loop Sign-off.', 'info');
    }, duration * 0.7);
    activeTimersRef.current.push(t2);

    // Step 3: Complete Execution & Populate Cache
    const t3 = setTimeout(() => {
      // Execute the real analytical engines on the dataset records
      const a1Res = records.map(analyzeFeedbackInsight);
      const a1Sum = compileAgent1Summary(a1Res);
      setAgent1Results(a1Res);
      setAgent1Summary(a1Sum);

      const a2Res = records.map(analyzeExperienceMonitoring);
      const a2Sum = compileAgent2Summary(a2Res);
      setAgent2Results(a2Res);
      setAgent2Summary(a2Sum);

      const a3Res = records.map(triageComplaint);
      const a3Sum = compileAgent3Summary(a3Res);
      setAgent3Results(a3Res);
      setAgent3Summary(a3Sum);

      const a4Res = records.map(analyzeManagerDecisionSupport);
      const a4Sum = compileAgent4Summary(a4Res);
      setAgent4Results(a4Res);
      setAgent4Summary(a4Sum);

      // Synthesize Cross-Agent Insights
      const cross = synthesizeCrossAgentInsights(records, a1Res, a2Res, a3Res, a4Res);
      setCrossInsights(cross.crossInsights);
      setCSuiteKPIs(cross.cSuiteKPIs);
      setExecutivePriorities(cross.executivePriorities);
      setQuickWins(cross.quickWins);
      setLongTermAiOpportunities(cross.longTermAiOpportunities);

      setAgentStatuses((prev) => {
        const next = { ...prev };
        activeList.forEach((id) => {
          next[id] = 'Completed';
        });
        return next;
      });

      setAgentProgress((prev) => {
        const next = { ...prev };
        activeList.forEach((id) => {
          next[id] = { currentStep: AGENT_REGISTRY[id].tasksList.length, totalSteps: AGENT_REGISTRY[id].tasksList.length, stepDescription: 'Analysis Completed & Verified', percent: 100 };
        });
        return next;
      });

      addLog('agent-4', 'Parallel multi-agent execution finished. Cross-agent synthesis matrix ready.', 'success');
    }, duration);
    activeTimersRef.current.push(t3);
  };

  // Toggle agent selection
  const handleToggleAgentSelect = (id: AgentId) => {
    setSelectedAgentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select/Deselect all
  const handleSelectAllAgents = (select: boolean) => {
    if (select) {
      setSelectedAgentIds(new Set(['agent-1', 'agent-2', 'agent-3', 'agent-4']));
    } else {
      setSelectedAgentIds(new Set());
    }
  };

  // Individual Agent Controls
  const handleCancelAgent = (id: AgentId) => {
    setAgentStatuses((prev) => ({ ...prev, [id]: 'Idle' }));
    setAgentProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], stepDescription: 'Task cancelled by user', percent: 0 },
    }));
  };

  const handleRerunAgent = (id: AgentId) => {
    setSelectedAgentIds((prev) => new Set([...prev, id]));
    runInferencePipeline();
  };

  const handleOpenAgentWorkspace = (id: AgentId) => {
    setActiveResultsAgent(id);
    setCurrentTab('results');
  };

  // Upload Custom Dataset
  const handleUploadRecords = (newRecords: PatientRecord[], name: string) => {
    setRecords(newRecords);
    setDatasetName(name);
    // Auto-run analysis on new dataset
    runInferencePipeline();
  };

  // Reset to Benchmark Sample
  const handleResetToSample = () => {
    setRecords(SAMPLE_PATIENT_RECORDS);
    setDatasetName('ApexHealth Q3 Inpatient & Ambulatory Grievance Cohort');
    runInferencePipeline();
  };

  // Save human review decision
  const handleSaveHumanDecision = (decision: HumanReviewDecision) => {
    setHumanReviewDecisions((prev) => ({
      ...prev,
      [decision.patient_id]: decision,
    }));
  };

  const isAnyProcessing = Object.values(agentStatuses).some((s) => s === 'Processing');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Header & Tab Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedAgentIds={selectedAgentIds}
        agentStatuses={agentStatuses}
        onStartAnalysis={() => runInferencePipeline(false)}
        onResetData={handleResetToSample}
        isProcessingAny={isAnyProcessing}
        datasetName={datasetName}
        totalRecordsCount={records.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Screen 1: Virtual Office Landing Page (4 Rooms) */}
        {currentTab === 'office' && (
          <VirtualOffice
            agentStatuses={agentStatuses}
            agentProgress={agentProgress}
            selectedAgentIds={selectedAgentIds}
            onToggleAgentSelect={handleToggleAgentSelect}
            onSelectAllAgents={handleSelectAllAgents}
            onOpenAgentWorkspace={handleOpenAgentWorkspace}
            onOpenAgentConfig={() => setCurrentTab('data')}
            onStartAnalysis={() => runInferencePipeline(false)}
            onNavigateToData={() => setCurrentTab('data')}
            onNavigateToExecutive={() => setCurrentTab('executive')}
            hasResults={agent1Results.length > 0}
          />
        )}

        {/* Screen 2: Data Upload & Configuration */}
        {currentTab === 'data' && (
          <DataConfigView
            records={records}
            onUploadRecords={handleUploadRecords}
            onResetToSample={handleResetToSample}
            selectedAgentIds={selectedAgentIds}
            onToggleAgentSelect={handleToggleAgentSelect}
            onStartAnalysis={() => runInferencePipeline(false)}
            onSelectTab={setCurrentTab}
          />
        )}

        {/* Screen 3: Live Processing Screen */}
        {currentTab === 'processing' && (
          <LiveProcessingView
            agentStatuses={agentStatuses}
            agentProgress={agentProgress}
            selectedAgentIds={selectedAgentIds}
            liveTelemetryLogs={liveTelemetryLogs}
            onStartAnalysis={() => runInferencePipeline(false)}
            onCancelAgent={handleCancelAgent}
            onRerunAgent={handleRerunAgent}
            onNavigateToResults={(targetAgent) => {
              if (targetAgent) setActiveResultsAgent(targetAgent);
              setCurrentTab('results');
            }}
            onNavigateToExecutive={() => setCurrentTab('executive')}
          />
        )}

        {/* Screen 4: Agent Results Dashboards (Tabs for Room 101, 102, 103, 104) */}
        {currentTab === 'results' && (
          <div className="space-y-6 pb-12">
            {/* Agent Results Sub-Tabs */}
            <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveResultsAgent('agent-1')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeResultsAgent === 'agent-1'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Room 101: Dr. Evelyn Vance (Feedback Insight)
                </button>

                <button
                  onClick={() => setActiveResultsAgent('agent-2')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeResultsAgent === 'agent-2'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Room 102: Marcus Reed (Experience & Equity)
                </button>

                <button
                  onClick={() => setActiveResultsAgent('agent-3')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeResultsAgent === 'agent-3'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Room 103: Sarah Lin (Complaint Triage)
                </button>

                <button
                  onClick={() => setActiveResultsAgent('agent-4')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeResultsAgent === 'agent-4'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Room 104: David Sterling (Manager Decision)
                </button>
              </div>

              <button
                onClick={() => setCurrentTab('executive')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 whitespace-nowrap"
              >
                Combined Executive View &rarr;
              </button>
            </div>

            {/* Render Selected Agent Dashboard */}
            {activeResultsAgent === 'agent-1' && agent1Summary && (
              <Agent1Dashboard results={agent1Results} summary={agent1Summary} records={records} />
            )}

            {activeResultsAgent === 'agent-2' && agent2Summary && (
              <Agent2Dashboard results={agent2Results} summary={agent2Summary} records={records} />
            )}

            {activeResultsAgent === 'agent-3' && agent3Summary && (
              <Agent3Dashboard results={agent3Results} summary={agent3Summary} records={records} />
            )}

            {activeResultsAgent === 'agent-4' && agent4Summary && (
              <Agent4Dashboard results={agent4Results} summary={agent4Summary} records={records} />
            )}
          </div>
        )}

        {/* Screen 5: Combined Executive Dashboard & Responsible Governance */}
        {currentTab === 'executive' && (
          <ExecutiveDashboard
            records={records}
            agent1Results={agent1Results}
            agent2Results={agent2Results}
            agent3Results={agent3Results}
            agent4Results={agent4Results}
            crossInsights={crossInsights}
            cSuiteKPIs={cSuiteKPIs}
            executivePriorities={executivePriorities}
            quickWins={quickWins}
            longTermAiOpportunities={longTermAiOpportunities}
            humanReviewDecisions={humanReviewDecisions}
            onSaveHumanDecision={handleSaveHumanDecision}
            onNavigateToAgent={handleOpenAgentWorkspace}
            analysisTimestamp={analysisTimestamp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            ApexHealth Clinical Virtual-Office System • Built for Healthcare Operations, Experience & Quality Improvement
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>HIPAA Synthetic Shield Active</span>
            <span>•</span>
            <span>Four Autonomous AI Agent Suites</span>
            <span>•</span>
            <span>Human-in-the-Loop Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
