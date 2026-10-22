import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Compass,
  FastForward,
  HelpCircle,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { BrandingConfig, DashboardAggregations, WeeklyReportData } from '../types/dashboard';

interface WeeklyInfographicProps {
  report: WeeklyReportData;
  aggregations: DashboardAggregations;
  branding: BrandingConfig;
  darkMode: boolean;
  onChange: (next: WeeklyReportData) => void;
  onExportElementAsImage: (elementId: string, filename: string) => void;
}

export const WeeklyInfographic: React.FC<WeeklyInfographicProps> = ({
  report,
  aggregations,
  branding,
  darkMode,
  onChange,
  onExportElementAsImage,
}) => {
  const [newItems, setNewItems] = useState<{
    whatWasDone: string;
    currentPlan: string;
    nextSteps: string;
    clientQueries: string;
  }>({
    whatWasDone: '',
    currentPlan: '',
    nextSteps: '',
    clientQueries: '',
  });

  const addItem = (key: keyof typeof newItems) => {
    const val = newItems[key].trim();
    if (!val) return;
    onChange({
      ...report,
      [key]: [...report[key], val],
    });
    setNewItems((prev) => ({ ...prev, [key]: '' }));
  };

  const removeItem = (
    key: 'whatWasDone' | 'currentPlan' | 'nextSteps' | 'clientQueries',
    idx: number
  ) => {
    onChange({
      ...report,
      [key]: report[key].filter((_, i) => i !== idx),
    });
  };

  const handleAutoSyncWithKPIs = () => {
    const topCountry = aggregations.countriesRanking[0]?.pais || 'LATAM';
    const topIndustry = aggregations.industriesDistribution[0]?.industria || 'Banca y Manufactura';
    onChange({
      ...report,
      whatWasDone: [
        `Ejecución de ${aggregations.totalSent} envíos de conexión B2B con ${aggregations.totalAccepted} aceptaciones (${aggregations.kpis.acceptanceRate.rate}% Tasa de Aceptación).`,
        `Gestión de ${aggregations.totalReplied} respuestas directas (${aggregations.kpis.responseRate.rate}% Tasa de Respuesta) y detección de ${aggregations.totalInterested} decisores interesados.`,
        `Coordinación de ${aggregations.totalMeetingsBooked} reuniones comerciales (${aggregations.totalQualifiedMTI} calificadas en Etapa MTI).`,
      ],
      currentPlan: [
        `Aceleración de secuencias outbound sobre vertical ${topIndustry} con mayor tracción en ${topCountry}.`,
        `Seguimiento activo a ${aggregations.totalPendingMTI} reuniones ejecutadas pendientes de calificación MTI.`,
        `Optimización del mensaje de conversión para decisores C-Level y Directores Comerciales.`,
      ],
      nextSteps: [
        `Cierre de calificación de las reuniones en curso y avance de oportunidades en etapa de Presupuesto.`,
        `Apertura de nuevo lote de prospección sobre cuentas Enterprise (+1000 empleados).`,
        `Revisión de casos de uso específicos para destrabar prospectos interesados sin fecha confirmada.`,
      ],
      clientQueries: [
        `Confirmar feedback comercial de las ${aggregations.totalPendingMTI} reuniones pendientes en la tabla operativa.`,
        `Validar disponibilidad de agenda de ejecutivos técnicos para las demos de la próxima semana.`,
        `Aprobar material de soporte comercial para cuentas en etapa de Presupuesto.`,
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Structured Input Editor */}
      <div
        className={`rounded-2xl border p-5 shadow-card ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              Configurador del Reporte Táctico Semanal
            </h2>
            <p className="text-xs text-slate-400">
              Edita los 4 bloques tácticos o sincronízalos automáticamente con los KPIs actuales. Abajo se genera la Infografía / Mapa Mental lista para exportar en HD.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAutoSyncWithKPIs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autocompletar con KPIs Actuales</span>
            </button>
            <button
              onClick={() =>
                onExportElementAsImage('weekly-mindmap-infographic', 'infografia_tactica_semanal_HD')
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Exportar Infografía HD (PNG)</span>
            </button>
          </div>
        </div>

        {/* Title & Date Range inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Título del Reporte Semanal
            </label>
            <input
              type="text"
              value={report.weekTitle}
              onChange={(e) => onChange({ ...report, weekTitle: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-semibold ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Periodo / Semana de Gestión
            </label>
            <input
              type="text"
              value={report.dateRangeLabel}
              onChange={(e) => onChange({ ...report, dateRangeLabel: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-semibold ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* 4 Structured Form Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              {
                key: 'whatWasDone',
                title: '1. ¿Qué se hizo en la semana?',
                subtitle: 'Hitos y volumen de prospección',
                accent: 'border-blue-500/40',
              },
              {
                key: 'currentPlan',
                title: '2. Plan en curso',
                subtitle: 'Estrategias activas de generación de demanda',
                accent: 'border-teal-500/40',
              },
              {
                key: 'nextSteps',
                title: '3. Próximos pasos',
                subtitle: 'Acciones tácticas para la siguiente semana',
                accent: 'border-indigo-500/40',
              },
              {
                key: 'clientQueries',
                title: '4. Consultas / Requerimientos al cliente',
                subtitle: 'Bloqueos, validaciones o insumos necesarios',
                accent: 'border-amber-500/40',
              },
            ] as const
          ).map((block) => (
            <div
              key={block.key}
              className={`p-3.5 rounded-xl border ${block.accent} ${
                darkMode ? 'bg-slate-800/60' : 'bg-slate-50/70'
              }`}
            >
              <div className="mb-2">
                <h4 className="text-xs font-bold">{block.title}</h4>
                <p className="text-[11px] text-slate-400">{block.subtitle}</p>
              </div>
              <ul className="space-y-1.5 mb-2.5">
                {report[block.key].map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start justify-between gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-white border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span className="flex-1">• {item}</span>
                    <button
                      onClick={() => removeItem(block.key, idx)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItems[block.key]}
                  onChange={(e) =>
                    setNewItems((prev) => ({ ...prev, [block.key]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem(block.key);
                    }
                  }}
                  placeholder="Agregar punto táctico..."
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => addItem(block.key)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPORTABLE INFOGRAPHIC / MIND MAP CANVAS */}
      <div
        id="weekly-mindmap-infographic"
        className={`rounded-3xl border p-6 sm:p-8 shadow-xl relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-slate-800 text-white'
            : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Infographic Header with Dual Branding Logos */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-600 text-white mb-2">
              Infografía Ejecutiva B2B • Mind Map Semanal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {report.weekTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Periodo evaluado: <strong>{report.dateRangeLabel}</strong>
            </p>
          </div>

          {/* 2 Institutional Logos */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {branding.clientLogoUrl ? (
                <img
                  src={branding.clientLogoUrl}
                  alt={branding.clientName}
                  className="h-8 w-auto object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {branding.clientName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Cliente</span>
                <span className="text-xs font-extrabold">{branding.clientName}</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {branding.agencyLogoUrl ? (
                <img
                  src={branding.agencyLogoUrl}
                  alt={branding.agencyName}
                  className="h-8 w-auto object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {branding.agencyName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Agencia / Partner</span>
                <span className="text-xs font-extrabold">{branding.agencyName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIND MAP VISUAL ARCHITECTURE: 4 Connected Nodes around Central Core */}
        <div className="relative my-8">
          {/* Decorative SVG Mind Map Connectors (visible on large screens) */}
          <svg
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
          >
            <path
              d="M 500 260 C 370 260, 340 120, 250 120"
              fill="none"
              stroke="#3B6EF6"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            <path
              d="M 500 260 C 630 260, 660 120, 750 120"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            <path
              d="M 500 260 C 370 260, 340 400, 250 400"
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            <path
              d="M 500 260 C 630 260, 660 400, 750 400"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Column: Node 1 & Node 3 */}
            <div className="lg:col-span-4 space-y-6">
              {/* Node 1: ¿Qué se hizo en la semana? */}
              <div
                className={`p-5 rounded-2xl border-2 border-blue-500/40 shadow-md ${
                  darkMode ? 'bg-slate-900/95' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">
                      Nodo 01 • Ejecución
                    </span>
                    <h3 className="text-sm font-extrabold">¿Qué se hizo en la semana?</h3>
                  </div>
                </div>
                <ul className="space-y-2 text-xs">
                  {report.whatWasDone.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-blue-500/15 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Node 3: Próximos pasos */}
              <div
                className={`p-5 rounded-2xl border-2 border-indigo-500/40 shadow-md ${
                  darkMode ? 'bg-slate-900/95' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FastForward className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">
                      Nodo 03 • Hoja de Ruta
                    </span>
                    <h3 className="text-sm font-extrabold">Próximos Pasos (Semana Siguiente)</h3>
                  </div>
                </div>
                <ul className="space-y-2 text-xs">
                  {report.nextSteps.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/15 text-indigo-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center Column: Central Hub Node (Executive KPI Core) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white shadow-2xl border-4 border-white/20 text-center">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 text-blue-100">
                  Núcleo de Rendimiento MTI
                </span>
                <h3 className="text-lg font-extrabold mt-2 mb-4">Resumen de Conversión B2B</h3>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase text-blue-200 font-semibold block">
                      Aceptación
                    </span>
                    <span className="text-xl font-extrabold">
                      {aggregations.kpis.acceptanceRate.rate}%
                    </span>
                    <span className="block text-[10px] text-blue-200">
                      {aggregations.totalAccepted}/{aggregations.totalSent} enviados
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase text-teal-200 font-semibold block">
                      Respuesta
                    </span>
                    <span className="text-xl font-extrabold">
                      {aggregations.kpis.responseRate.rate}%
                    </span>
                    <span className="block text-[10px] text-teal-200">
                      {aggregations.totalReplied}/{aggregations.totalAccepted} aceptados
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase text-indigo-200 font-semibold block">
                      Conv. Reuniones
                    </span>
                    <span className="text-xl font-extrabold">
                      {aggregations.kpis.meetingConversionRate.rate}%
                    </span>
                    <span className="block text-[10px] text-indigo-200">
                      {aggregations.totalMeetingsBooked}/{aggregations.totalInterested} interesados
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase text-amber-200 font-semibold block">
                      Calificación MTI
                    </span>
                    <span className="text-xl font-extrabold">
                      {aggregations.kpis.qualificationRate.rate}%
                    </span>
                    <span className="block text-[10px] text-amber-200">
                      {aggregations.totalQualifiedMTI}/{aggregations.totalMeetingsExecuted} ejecutadas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Node 2 & Node 4 */}
            <div className="lg:col-span-4 space-y-6">
              {/* Node 2: Plan en curso */}
              <div
                className={`p-5 rounded-2xl border-2 border-teal-500/40 shadow-md ${
                  darkMode ? 'bg-slate-900/95' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-500">
                      Nodo 02 • Estrategia Activa
                    </span>
                    <h3 className="text-sm font-extrabold">Plan en Curso</h3>
                  </div>
                </div>
                <ul className="space-y-2 text-xs">
                  {report.currentPlan.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-teal-500/15 text-teal-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Node 4: Consultas / Requerimientos al cliente */}
              <div
                className={`p-5 rounded-2xl border-2 border-amber-500/40 shadow-md ${
                  darkMode ? 'bg-slate-900/95' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                      Nodo 04 • Alineación Cliente
                    </span>
                    <h3 className="text-sm font-extrabold">Consultas / Requerimientos al Cliente</h3>
                  </div>
                </div>
                <ul className="space-y-2 text-xs">
                  {report.clientQueries.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        !
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
