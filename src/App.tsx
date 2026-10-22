import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  ColumnMapping,
  GlobalFilterState,
  LeadRecord,
  MergeRule,
  QualificationStatus,
  SemanticSuggestion,
} from './types/dashboard';
import { SAMPLE_CSV_CONTENT } from './data/sampleData';
import { autoDetectColumns, buildLeadsFromRawRows } from './utils/columnDetector';
import { applyMergeRulesToLeads, generateSemanticSuggestions } from './utils/smartMerge';
import { calculateDashboardAggregations, filterLeads } from './utils/kpiCalculator';
import { exportLeadsToCSV } from './utils/csvExporter';
import { Header } from './components/Header';
import { GlobalFilters } from './components/GlobalFilters';
import { ColumnMapperModal } from './components/ColumnMapperModal';
import { SmartMergeModal } from './components/SmartMergeModal';
import { ScorecardsRow } from './components/ScorecardsRow';
import { ChartsGrid } from './components/ChartsGrid';
import { InteractiveTables } from './components/InteractiveTables';

const STORAGE_KEYS = {
  LEADS: 'mti_b2b_leads_v1',
  RULES: 'mti_b2b_merge_rules_v1',
  DATASET_NAME: 'mti_b2b_dataset_name_v1',
};

const INITIAL_FILTERS: GlobalFilterState = {
  datePreset: 'all',
  startDate: '2026-08-01',
  endDate: '2026-10-31',
  comparePreviousPeriod: true,
  selectedCountry: 'ALL',
  selectedIndustry: 'ALL',
  selectedRole: 'ALL',
  selectedCampaign: 'ALL',
  searchQuery: '',
};

export const App: React.FC = () => {
  const [datasetName, setDatasetName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.DATASET_NAME) || 'sample_b2b_leads.csv (Demostración)';
  });

  // Raw CSV state for Column Mapper Modal
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(() =>
    autoDetectColumns([
      'ID',
      'Empresa',
      'Pais',
      'Industria',
      'Cargo',
      'Campana',
      'Fecha_Ejecucion',
      'Invitacion_Aceptada',
      'Respondio',
      'Interesado',
      'Fecha_Interes',
      'Reunion_Agendada',
      'Fecha_Reunion',
      'Calificacion_Reunion',
      'Feedback_Reunion',
    ])
  );

  // Merge Rules (Smart Merge)
  const [mergeRules, setMergeRules] = useState<MergeRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RULES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Base Leads (before merge rules)
  const [baseLeads, setBaseLeads] = useState<LeadRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const parsedCsv = Papa.parse<Record<string, unknown>>(SAMPLE_CSV_CONTENT, {
      header: true,
      skipEmptyLines: true,
    });
    const headers = parsedCsv.meta.fields || [];
    const mapping = autoDetectColumns(headers);
    return buildLeadsFromRawRows(parsedCsv.data, mapping);
  });

  // Modals & UI visibility
  const [showFiltersBar, setShowFiltersBar] = useState<boolean>(true);
  const [isMapperOpen, setIsMapperOpen] = useState<boolean>(false);
  const [isSmartMergeOpen, setIsSmartMergeOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<GlobalFilterState>(INITIAL_FILTERS);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(baseLeads));
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(mergeRules));
      localStorage.setItem(STORAGE_KEYS.DATASET_NAME, datasetName);
    } catch {
      // ignore storage quota errors
    }
  }, [baseLeads, mergeRules, datasetName]);

  // Apply Smart Merge Rules to Base Leads
  const normalizedLeads = useMemo(
    () => applyMergeRulesToLeads(baseLeads, mergeRules),
    [baseLeads, mergeRules]
  );

  // Semantic / Fuzzy Matching Suggestions on currently normalized leads
  const semanticSuggestions = useMemo(
    () => generateSemanticSuggestions(normalizedLeads, mergeRules),
    [normalizedLeads, mergeRules]
  );

  // Filter Leads & Compute KPIs + Chart Aggregations
  const { currentLeads, previousLeads } = useMemo(
    () => filterLeads(normalizedLeads, filters),
    [normalizedLeads, filters]
  );

  const aggregations = useMemo(
    () => calculateDashboardAggregations(currentLeads, previousLeads),
    [currentLeads, previousLeads]
  );

  // Unique dimension options for GlobalFilters
  const uniqueCountries = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.pais))).sort(),
    [normalizedLeads]
  );
  const uniqueIndustries = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.industria))).sort(),
    [normalizedLeads]
  );
  const uniqueRoles = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.cargo))).sort(),
    [normalizedLeads]
  );
  const uniqueCampaigns = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.campana))).sort(),
    [normalizedLeads]
  );

  // Handle CSV Upload
  const handleFileUpload = (file: File) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || Object.keys(results.data[0] || {});
        const detected = autoDetectColumns(headers);
        setRawHeaders(headers);
        setRawRows(results.data);
        setColumnMapping(detected);
        setDatasetName(file.name);
        setIsMapperOpen(true);
      },
    });
  };

  // Open Mapper on current dataset if user clicks "Mapeo de Columnas"
  const handleOpenMapperManual = () => {
    if (rawHeaders.length === 0) {
      const parsedCsv = Papa.parse<Record<string, unknown>>(SAMPLE_CSV_CONTENT, {
        header: true,
        skipEmptyLines: true,
      });
      const headers = parsedCsv.meta.fields || [];
      setRawHeaders(headers);
      setRawRows(parsedCsv.data);
      setColumnMapping(autoDetectColumns(headers));
    }
    setIsMapperOpen(true);
  };

  const handleConfirmMapping = (confirmedMapping: ColumnMapping, openSmartMergeNext: boolean) => {
    setColumnMapping(confirmedMapping);
    if (rawRows.length > 0) {
      const built = buildLeadsFromRawRows(rawRows, confirmedMapping);
      setBaseLeads(built);
    }
    setIsMapperOpen(false);
    if (openSmartMergeNext) {
      setIsSmartMergeOpen(true);
    }
  };

  // Smart Merge Handlers
  const handleApplyRule = (rule: MergeRule) => {
    setMergeRules((prev) => [...prev, rule]);
  };

  const handleApplyAllSuggestions = (suggestionsToApply: SemanticSuggestion[]) => {
    const newRules: MergeRule[] = suggestionsToApply.map((sug, idx) => ({
      id: `auto-batch-${Date.now()}-${idx}`,
      field: sug.field,
      targetCategory: sug.suggestedCategory,
      sourceValues: sug.matchedValues.map((m) => m.value),
      autoGenerated: true,
    }));
    setMergeRules((prev) => [...prev, ...newRules]);
  };

  const handleRemoveRule = (ruleId: string) => {
    setMergeRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleClearAllRules = () => {
    setMergeRules([]);
  };

  // Real-time Meeting Feedback & Qualification Handler
  const handleUpdateMeetingFeedback = (
    leadId: string,
    calificacion: QualificationStatus,
    feedback: string
  ) => {
    setBaseLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              calificacion,
              feedback,
            }
          : lead
      )
    );
  };

  // Promote an Interested Lead to a Scheduled Meeting
  const handlePromoteToMeeting = (leadId: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setBaseLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              reunionAgendada: true,
              fechaReunion: lead.fechaReunion || todayStr,
              calificacion: 'Pendiente',
            }
          : lead
      )
    );
  };

  // Reset to clean Demo Data
  const handleResetDemo = () => {
    const parsedCsv = Papa.parse<Record<string, unknown>>(SAMPLE_CSV_CONTENT, {
      header: true,
      skipEmptyLines: true,
    });
    const headers = parsedCsv.meta.fields || [];
    const mapping = autoDetectColumns(headers);
    setBaseLeads(buildLeadsFromRawRows(parsedCsv.data, mapping));
    setMergeRules([]);
    setFilters(INITIAL_FILTERS);
    setDatasetName('sample_b2b_leads.csv (Demostración)');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 pb-16">
      {/* Top SaaS Header */}
      <Header
        datasetName={datasetName}
        totalLeads={normalizedLeads.length}
        pendingSuggestionsCount={semanticSuggestions.length}
        activeRulesCount={mergeRules.length}
        showFiltersBar={showFiltersBar}
        onToggleFiltersBar={() => setShowFiltersBar((v) => !v)}
        onFileUpload={handleFileUpload}
        onOpenMapper={handleOpenMapperManual}
        onOpenSmartMerge={() => setIsSmartMergeOpen(true)}
        onExportCSV={() => exportLeadsToCSV(normalizedLeads)}
        onResetDemo={handleResetDemo}
      />

      {/* Smart Merge Alert Banner when unmerged variations are detected */}
      {semanticSuggestions.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-4">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl p-3.5 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Smart Merge detectó {semanticSuggestions.length} agrupaciones semánticas sugeridas:</span>{' '}
                <span className="text-indigo-100">
                  Variaciones como &ldquo;banking&rdquo; / &ldquo;Banca&rdquo; y &ldquo;manufactura automotriz&rdquo; / &ldquo;manufactura de alimentos&rdquo; / &ldquo;fabricación de artículos&rdquo; pueden consolidarse.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApplyAllSuggestions(semanticSuggestions)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unificar Todo Automáticamente</span>
              </button>
              <button
                onClick={() => setIsSmartMergeOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <span>Revisar en Smart Merge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Temporal & Dimension Filters */}
      {showFiltersBar && (
        <GlobalFilters
          filters={filters}
          countries={uniqueCountries}
          industries={uniqueIndustries}
          roles={uniqueRoles}
          campaigns={uniqueCampaigns}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
        />
      )}

      {/* Main Dashboard Container */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-5">
        {/* 4 Executive KPI Scorecards */}
        <ScorecardsRow
          kpis={aggregations.kpis}
          comparePreviousPeriod={filters.comparePreviousPeriod}
        />

        {/* High-Level Visualizations Grid (SaaS Reference Layout) */}
        <ChartsGrid
          aggregations={aggregations}
          selectedCountry={filters.selectedCountry}
          selectedIndustry={filters.selectedIndustry}
          onSelectCountry={(pais) => setFilters((prev) => ({ ...prev, selectedCountry: pais }))}
          onSelectIndustry={(industria) =>
            setFilters((prev) => ({ ...prev, selectedIndustry: industria }))
          }
        />

        {/* Dynamic & Interactive Tables: Scheduled Meetings (with Live Feedback) & Interested Leads */}
        <InteractiveTables
          leads={currentLeads}
          onUpdateMeetingFeedback={handleUpdateMeetingFeedback}
          onPromoteToMeeting={handlePromoteToMeeting}
        />
      </main>

      {/* Modals */}
      <ColumnMapperModal
        isOpen={isMapperOpen}
        headers={rawHeaders}
        sampleRow={rawRows[0]}
        initialMapping={columnMapping}
        onConfirm={handleConfirmMapping}
        onClose={() => setIsMapperOpen(false)}
      />

      <SmartMergeModal
        isOpen={isSmartMergeOpen}
        leads={normalizedLeads}
        rules={mergeRules}
        suggestions={semanticSuggestions}
        onApplyRule={handleApplyRule}
        onApplyAllSuggestions={handleApplyAllSuggestions}
        onRemoveRule={handleRemoveRule}
        onClearAllRules={handleClearAllRules}
        onClose={() => setIsSmartMergeOpen(false)}
      />
    </div>
  );
};

export default App;
