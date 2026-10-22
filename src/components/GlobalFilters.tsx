import React from 'react';
import { Calendar, Globe, Building2, Briefcase, Search, X, TrendingUp } from 'lucide-react';
import { GlobalFilterState } from '../types/dashboard';

interface GlobalFiltersProps {
  filters: GlobalFilterState;
  countries: string[];
  industries: string[];
  roles: string[];
  campaigns: string[];
  onChange: (next: GlobalFilterState) => void;
  onReset: () => void;
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filters,
  countries,
  industries,
  roles,
  campaigns,
  onChange,
  onReset,
}) => {
  const update = (patch: Partial<GlobalFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const hasActiveFilters =
    filters.datePreset !== 'all' ||
    filters.selectedCountry !== 'ALL' ||
    filters.selectedIndustry !== 'ALL' ||
    filters.selectedRole !== 'ALL' ||
    filters.selectedCampaign !== 'ALL' ||
    filters.searchQuery.trim() !== '';

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4 flex flex-col gap-3.5">
        {/* Top Row: Temporal Presets & Custom Date Range Picker */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Periodo:</span>
            </div>

            {(
              [
                { id: 'all', label: 'Todo el Historial' },
                { id: 'last30', label: 'Últimos 30 días' },
                { id: 'month', label: 'Mes Actual' },
                { id: 'quarter', label: 'Último Bimestre / Q' },
                { id: 'custom', label: 'Rango Personalizado' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => update({ datePreset: preset.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.datePreset === preset.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {preset.label}
              </button>
            ))}

            {filters.datePreset === 'custom' && (
              <div className="flex items-center gap-2 ml-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => update({ startDate: e.target.value })}
                  className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none"
                />
                <span className="text-slate-400 text-xs">a</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => update({ endDate: e.target.value })}
                  className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.comparePreviousPeriod}
                onChange={(e) => update({ comparePreviousPeriod: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Comparar vs. periodo anterior</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Dimension Selectors (Country, Normalized Industry, Role, Search) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => update({ searchQuery: e.target.value })}
              placeholder="Buscar empresa, cargo, feedback..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase text-slate-400 leading-none">País</span>
              <select
                value={filters.selectedCountry}
                onChange={(e) => update({ selectedCountry: e.target.value })}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none truncate mt-0.5"
              >
                <option value="ALL">Todos los países ({countries.length})</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase text-slate-400 leading-none">
                Industria (Normalizada)
              </span>
              <select
                value={filters.selectedIndustry}
                onChange={(e) => update({ selectedIndustry: e.target.value })}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none truncate mt-0.5"
              >
                <option value="ALL">Todas las industrias ({industries.length})</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5">
            <Briefcase className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase text-slate-400 leading-none">Cargo / Rol</span>
              <select
                value={filters.selectedRole}
                onChange={(e) => update({ selectedRole: e.target.value })}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none truncate mt-0.5"
              >
                <option value="ALL">Todos los cargos ({roles.length})</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campaign Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase text-slate-400 leading-none">Campaña B2B</span>
              <select
                value={filters.selectedCampaign}
                onChange={(e) => update({ selectedCampaign: e.target.value })}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none truncate mt-0.5"
              >
                <option value="ALL">Todas las campañas ({campaigns.length})</option>
                {campaigns.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
