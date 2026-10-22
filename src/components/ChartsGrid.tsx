import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Sparkles, Award, Globe, PieChart as PieIcon, Activity, CheckCircle2 } from 'lucide-react';
import { DashboardAggregations } from '../types/dashboard';

interface ChartsGridProps {
  aggregations: DashboardAggregations;
  selectedCountry: string;
  selectedIndustry: string;
  onSelectCountry: (country: string) => void;
  onSelectIndustry: (industry: string) => void;
}

export const ChartsGrid: React.FC<ChartsGridProps> = ({
  aggregations,
  selectedCountry,
  selectedIndustry,
  onSelectCountry,
  onSelectIndustry,
}) => {
  const {
    countriesRanking,
    industriesDistribution,
    rolesRanking,
    timelineSeries,
    funnelCapabilities,
    totalInterested,
    totalMeetings,
    totalQualified,
    totalDisqualified,
    totalPendingFeedback,
    kpis,
  } = aggregations;

  // Gauge Chart Data for Qualification Rate (like "Customer Satisfaction / NPS" in reference)
  const qualRate = kpis.qualificationRate.rate;
  const gaugeSegments = [
    { name: 'Descalificadas', value: Math.max(totalDisqualified, 0.2), color: '#F5B041' },
    { name: 'Pendientes', value: Math.max(totalPendingFeedback, 0.2), color: '#4CC9B0' },
    { name: 'Calificadas', value: Math.max(totalQualified, 0.4), color: '#3B6EF6' },
  ];

  const top3Roles = rolesRanking.slice(0, 3);
  const restRoles = rolesRanking.slice(3, 8);

  return (
    <div className="space-y-5 mt-5">
      {/* Row 1: Top Countries Bar Chart (5 cols) + Radar Capabilities (4 cols) + Industries Donut (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Países con más Interesados (Comparative Bar Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Países con más Interesados</h3>
                {selectedCountry !== 'ALL' && (
                  <button
                    onClick={() => onSelectCountry('ALL')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 cursor-pointer"
                  >
                    Filtro: {selectedCountry} ✕
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B6EF6]" /> Interesados ({totalInterested})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4CC9B0]" /> Reuniones Agendadas ({totalMeetings})
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> Top Mercados
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={countriesRanking.slice(0, 8)}
                margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="pais"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="interesados"
                  name="Interesados"
                  fill="#3B6EF6"
                  radius={[6, 6, 0, 0]}
                  barSize={14}
                  onClick={(data) => {
                    if (data?.pais) {
                      onSelectCountry(selectedCountry === data.pais ? 'ALL' : data.pais);
                    }
                  }}
                  className="cursor-pointer"
                />
                <Bar
                  dataKey="reuniones"
                  name="Reuniones Agendadas"
                  fill="#4CC9B0"
                  radius={[6, 6, 0, 0]}
                  barSize={14}
                  onClick={(data) => {
                    if (data?.pais) {
                      onSelectCountry(selectedCountry === data.pais ? 'ALL' : data.pais);
                    }
                  }}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Industrias con más Interesados (Donut Chart with Total in Center) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Industrias con más Interesados</h3>
              <p className="text-xs text-slate-400">Consolidado mediante Smart Merge</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3 h-3" /> Smart Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 my-auto">
            {/* Donut Chart with Centered Number */}
            <div className="sm:col-span-6 h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industriesDistribution}
                    dataKey="interesados"
                    nameKey="industria"
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={3}
                    onClick={(entry) => {
                      if (entry?.industria) {
                        onSelectIndustry(selectedIndustry === entry.industria ? 'ALL' : entry.industria);
                      }
                    }}
                    className="cursor-pointer focus:outline-none"
                  >
                    {industriesDistribution.map((entry) => (
                      <Cell
                        key={entry.industria}
                        fill={entry.color}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val} interesados`, name]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">
                  {totalInterested}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-1">Interesados</span>
              </div>
            </div>

            {/* Interactive Industry Legend */}
            <div className="sm:col-span-6 space-y-2 max-h-52 overflow-y-auto pr-1">
              {industriesDistribution.map((ind) => {
                const isSelected = selectedIndustry === ind.industria;
                return (
                  <button
                    key={ind.industria}
                    onClick={() => onSelectIndustry(isSelected ? 'ALL' : ind.industria)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 font-bold text-blue-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ind.color }}
                      />
                      <span className="truncate font-medium">{ind.industria}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-slate-900">{ind.interesados}</span>
                      <span className="text-[10px] text-slate-400">({ind.percentage}%)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Radar Chart - Rendimiento del Embudo Comercial */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Capacidad del Embudo</h3>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3B6EF6]" /> Campaña Actual
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4CC9B0]" /> Benchmark B2B
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="68%" data={funnelCapabilities}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Actual (%)"
                  dataKey="current"
                  stroke="#3B6EF6"
                  strokeWidth={2}
                  fill="#3B6EF6"
                  fillOpacity={0.22}
                />
                <Radar
                  name="Benchmark B2B (%)"
                  dataKey="benchmark"
                  stroke="#4CC9B0"
                  strokeWidth={2}
                  fill="#4CC9B0"
                  fillOpacity={0.15}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Semicircular Gauge Qualification (3 cols) + Smooth Timeline Area Chart (5 cols) + Cargos Ranking Podium (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 4: Calificación de Reuniones (Gauge Semicircular + Breakdown Table like "Customer Satisfaction" in reference) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Calidad de Reuniones</h3>
              <p className="text-xs text-slate-400">Feedback en vivo del equipo comercial</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          {/* Semicircular Gauge */}
          <div className="h-40 relative flex items-center justify-center -mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeSegments}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="80%"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={3}
                >
                  {gaugeSegments.map((seg) => (
                    <Cell key={seg.name} fill={seg.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-3 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Tasa Calificación
              </span>
              <span className="text-3xl font-extrabold text-slate-900 leading-tight">
                {qualRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Breakdown Table (Exact match to reference bottom-left card) */}
          <div className="mt-3 bg-slate-50/70 rounded-xl border border-slate-100 p-3">
            <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-200/70">
              <span>Estado</span>
              <span className="text-center">Proporción</span>
              <span className="text-right">Reuniones</span>
            </div>
            <div className="divide-y divide-slate-200/50 text-xs">
              <div className="grid grid-cols-3 py-2 items-center">
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3B6EF6]" /> Calificadas
                </span>
                <span className="text-center font-medium text-slate-600">
                  {totalMeetings > 0 ? ((totalQualified / totalMeetings) * 100).toFixed(1) : '0.0'}%
                </span>
                <span className="text-right font-bold text-slate-900">{totalQualified}</span>
              </div>
              <div className="grid grid-cols-3 py-2 items-center">
                <span className="font-semibold text-teal-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4CC9B0]" /> Sin Feedback
                </span>
                <span className="text-center font-medium text-slate-600">
                  {totalMeetings > 0
                    ? ((totalPendingFeedback / totalMeetings) * 100).toFixed(1)
                    : '0.0'}
                  %
                </span>
                <span className="text-right font-bold text-amber-600">{totalPendingFeedback}</span>
              </div>
              <div className="grid grid-cols-3 py-2 items-center">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F5B041]" /> Descalificadas
                </span>
                <span className="text-center font-medium text-slate-600">
                  {totalMeetings > 0
                    ? ((totalDisqualified / totalMeetings) * 100).toFixed(1)
                    : '0.0'}
                  %
                </span>
                <span className="text-right font-bold text-slate-900">{totalDisqualified}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Evolución Temporal de Demanda y Reuniones (Smooth Area Chart like "Deals" in reference) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Evolución de Demanda & Reuniones
              </h3>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B6EF6]" /> Interesados Generados
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4CC9B0]" /> Reuniones Agendadas
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> Tendencia Temporal
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineSeries} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradInteresados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B6EF6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#3B6EF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradReuniones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC9B0" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#4CC9B0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="interesados"
                  name="Interesados"
                  stroke="#3B6EF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradInteresados)"
                />
                <Area
                  type="monotone"
                  dataKey="reuniones"
                  name="Reuniones Agendadas"
                  stroke="#4CC9B0"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradReuniones)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 6: Cargos con más Interesados (Podium + Ranking Card like "Sales Ranking" in reference) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cargos con más Interesados</h3>
              <p className="text-xs text-slate-400">Ranking de decisores y conversión a cita</p>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          {/* Top 3 Podium (matches reference image avatar ranking layout) */}
          {top3Roles.length > 0 && (
            <div className="grid grid-cols-3 gap-2 items-end pt-2 pb-4 border-b border-slate-100">
              {/* #2 Second Place */}
              {top3Roles[1] ? (
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-700 font-extrabold text-sm shadow-xs">
                      {top3Roles[1].cargo.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-600 text-white">
                      2
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-semibold text-slate-700 mt-2.5 line-clamp-1"
                    title={top3Roles[1].cargo}
                  >
                    {top3Roles[1].cargo}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    {top3Roles[1].interesados}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {top3Roles[1].reuniones} citas
                  </span>
                </div>
              ) : (
                <div />
              )}

              {/* #1 First Place (Elevated Center) */}
              {top3Roles[0] && (
                <div className="flex flex-col items-center text-center -mt-2">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 font-extrabold text-base shadow-sm">
                      {top3Roles[0].cargo.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      1
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold text-slate-900 mt-2.5 line-clamp-1"
                    title={top3Roles[0].cargo}
                  >
                    {top3Roles[0].cargo}
                  </span>
                  <span className="text-lg font-extrabold text-blue-600">
                    {top3Roles[0].interesados}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {top3Roles[0].reuniones} citas ({top3Roles[0].conversionRate}%)
                  </span>
                </div>
              )}

              {/* #3 Third Place */}
              {top3Roles[2] ? (
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-amber-300/80 flex items-center justify-center text-amber-800 font-extrabold text-sm shadow-xs">
                      {top3Roles[2].cargo.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-700 text-white">
                      3
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-semibold text-slate-700 mt-2.5 line-clamp-1"
                    title={top3Roles[2].cargo}
                  >
                    {top3Roles[2].cargo}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    {top3Roles[2].interesados}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {top3Roles[2].reuniones} citas
                  </span>
                </div>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Remaining Roles Table List */}
          <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {restRoles.map((r, i) => (
              <div
                key={r.cargo}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 4}</span>
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {r.cargo.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 truncate">{r.cargo}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400">{r.reuniones} citas</span>
                  <span className="font-extrabold text-slate-900">{r.interesados}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
