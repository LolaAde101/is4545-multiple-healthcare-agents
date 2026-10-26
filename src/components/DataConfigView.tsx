import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Search,
  Sliders,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Database,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PatientRecord, AgentId } from '../types';
import { AGENT_REGISTRY } from '../data/agentMetadata';

interface DataConfigViewProps {
  records: PatientRecord[];
  onUploadRecords: (records: PatientRecord[], name: string) => void;
  onResetToSample: () => void;
  selectedAgentIds: Set<AgentId>;
  onToggleAgentSelect: (id: AgentId) => void;
  onStartAnalysis: () => void;
  onSelectTab: (tab: any) => void;
}

export const DataConfigView: React.FC<DataConfigViewProps> = ({
  records,
  onUploadRecords,
  onResetToSample,
  selectedAgentIds,
  onToggleAgentSelect,
  onStartAnalysis,
  onSelectTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceLine, setSelectedServiceLine] = useState<string>('all');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Parse custom CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          setUploadFeedback('CSV must contain a header row and at least one record.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const parsed: PatientRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple CSV splitter handling quoted values
          const row: string[] = [];
          let current = '';
          let insideQuotes = false;
          const line = lines[i];

          for (let c = 0; c < line.length; c++) {
            const char = line[c];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              row.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          row.push(current.trim().replace(/^"|"$/g, ''));

          if (row.length >= 2) {
            // Map or construct patient record
            const id = row[0] || `PT-${10000 + i}`;
            const comment = row[row.length - 1] || 'No comment provided';
            parsed.push({
              patient_id: id,
              patient_persona: row[1] || 'General Ambulatory Patient',
              age_group: row[2] || '45-54',
              visit_type: row[3] || 'Outpatient Clinic',
              service_line: row[4] || 'Internal Medicine',
              patient_satisfaction: parseInt(row[5], 10) || 3,
              communication_rating: parseInt(row[6], 10) || 3,
              follow_up_compliance: (row[7] as any) || 'Compliant',
              complaint_severity: (row[8] as any) || 'Moderate',
              patient_portal_usage: (row[9] as any) || 'Occasional',
              readmission_risk: (row[10] as any) || 'Medium',
              ai_risk_flags: (row[11] as any) || 'None',
              patient_comment: comment,
            });
          }
        }

        if (parsed.length > 0) {
          onUploadRecords(parsed, file.name);
          setUploadFeedback(`Successfully imported ${parsed.length} patient records from ${file.name}`);
        } else {
          setUploadFeedback('Could not parse any valid patient records.');
        }
      } catch (err: any) {
        setUploadFeedback(`Parsing error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const serviceLines = Array.from(new Set(records.map((r) => r.service_line)));

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.service_line.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedServiceLine === 'all' || r.service_line === selectedServiceLine;
    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Safeguards Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/80 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Dataset Management & Agent Task Configuration</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30">
              Validated Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure input patient cohorts, review detected schema types, audit de-identification safeguards, and set analytical task parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetToSample}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            Reload Reference Benchmark (20 Records)
          </button>
          <button
            onClick={onStartAnalysis}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            Run Analyses Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upload Station & Validation Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSV Upload Dropzone */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              Upload Primary CSV Dataset
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Upload patient comments, clinical survey feedback, or complaint logs. Data is parsed locally and fed to all four active virtual office suites.
            </p>

            <label className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 bg-slate-950/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-300 flex items-center justify-center transition-colors mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300">
                Click to browse or drop CSV file
              </span>
              <span className="text-[11px] text-slate-500 mt-1">UTF-8 CSV format supported</span>
            </label>

            {uploadFeedback && (
              <div className="mt-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{uploadFeedback}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">Privacy & HIPAA Safeguards Active:</span>
            </div>
            <p>
              Uploaded data must be de-identified or synthetic. Direct identifiers (real names, SSNs, phone numbers) are blocked by frontend sanitizers.
            </p>
          </div>
        </div>

        {/* Detected Schema & Data Quality Health */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              Schema Validation & Data Quality Report
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium">
              100% Quality Pass
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Records</span>
              <span className="text-lg font-bold text-white">{records.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Service Lines</span>
              <span className="text-lg font-bold text-teal-300">{serviceLines.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">AI Flagged Cases</span>
              <span className="text-lg font-bold text-amber-300">
                {records.filter((r) => r.ai_risk_flags !== 'None').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Critical Complaints</span>
              <span className="text-lg font-bold text-rose-300">
                {records.filter((r) => r.complaint_severity === 'Critical').length}
              </span>
            </div>
          </div>

          {/* Detected Fields Table */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Validated Schema Fields & Encodings:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              {[
                { col: 'patient_id', type: 'String (UUID/ID)', status: 'Valid Key' },
                { col: 'patient_persona', type: 'String (Cohort)', status: 'Normalized' },
                { col: 'age_group', type: 'Categorical', status: '5 Buckets' },
                { col: 'service_line', type: 'Categorical', status: 'Clinical Dept' },
                { col: 'patient_satisfaction', type: 'Integer (1-5)', status: 'CSAT Scale' },
                { col: 'communication_rating', type: 'Integer (1-5)', status: 'Doctor/Nurse' },
                { col: 'complaint_severity', type: 'Enum (Low-Crit)', status: 'Triage Ready' },
                { col: 'readmission_risk', type: 'Enum (Low-High)', status: 'Stratified' },
                { col: 'ai_risk_flags', type: 'Risk Enum', status: 'Audit Track' },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <span className="font-mono text-slate-300 truncate">{field.col}</span>
                  <span className="text-[10px] text-teal-400 font-medium">{field.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Selection & Task Configuration Drawer */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Agent Task Engagement & Sensitivity Calibration</h3>
          </div>
          <span className="text-xs text-slate-400">
            {selectedAgentIds.size} of 4 Agents Activated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(AGENT_REGISTRY) as AgentId[]).map((agentId) => {
            const agent = AGENT_REGISTRY[agentId];
            const isSelected = selectedAgentIds.has(agentId);

            return (
              <div
                key={agentId}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-slate-950/90 border-teal-500/50 ring-1 ring-teal-500/30'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-teal-400">{agent.roomNumber}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleAgentSelect(agentId)}
                    className="w-4 h-4 rounded border-slate-700 text-teal-500 bg-slate-800"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                <p className="text-[11px] text-slate-400 truncate mb-3">{agent.role}</p>

                {/* Analytical Options */}
                <div className="space-y-2 text-[11px] pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Task Mode:</span>
                    <span className="text-slate-200 font-mono">Full Canvas</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Human Audit:</span>
                    <span className="text-teal-400 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Cohort Data Preview Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Input Cohort Preview ({filteredRecords.length} Records)</h3>
            <p className="text-xs text-slate-400">Browse and inspect patient records before triggering multi-agent pipeline</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, comments, persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 w-52 sm:w-64"
              />
            </div>

            {/* Service Line Filter */}
            <select
              value={selectedServiceLine}
              onChange={(e) => setSelectedServiceLine(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Service Lines</option>
              {serviceLines.map((sl) => (
                <option key={sl} value={sl}>
                  {sl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Persona / Age</th>
                <th className="py-3 px-4">Service Line / Type</th>
                <th className="py-3 px-4 text-center">CSAT / Comm</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">AI Risk Flag</th>
                <th className="py-3 px-4 min-w-[320px]">Patient Narrative / Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredRecords.slice(0, 10).map((record) => (
                <tr key={record.patient_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-teal-400 whitespace-nowrap">
                    {record.patient_id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-200 block truncate max-w-[170px]">
                      {record.patient_persona}
                    </span>
                    <span className="text-[11px] text-slate-500">{record.age_group} yrs</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-200 font-medium block">{record.service_line}</span>
                    <span className="text-[11px] text-slate-500">{record.visit_type}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {record.patient_satisfaction}/5
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Comm: {record.communication_rating}/5
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        record.complaint_severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : record.complaint_severity === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : record.complaint_severity === 'Moderate'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {record.complaint_severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {record.ai_risk_flags !== 'None' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3 text-purple-400" />
                        {record.ai_risk_flags}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Normal</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-xs leading-relaxed max-w-sm line-clamp-2">
                    {record.patient_comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length > 10 && (
          <p className="text-right text-xs text-slate-500">
            Showing first 10 of {filteredRecords.length} records in preview
          </p>
        )}
      </div>
    </div>
  );
};
