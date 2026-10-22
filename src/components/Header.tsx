import React, { useRef } from 'react';
import {
  Upload,
  Sparkles,
  SlidersHorizontal,
  Download,
  Columns,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface HeaderProps {
  datasetName: string;
  totalLeads: number;
  pendingSuggestionsCount: number;
  activeRulesCount: number;
  showFiltersBar: boolean;
  onToggleFiltersBar: () => void;
  onFileUpload: (file: File) => void;
  onOpenMapper: () => void;
  onOpenSmartMerge: () => void;
  onExportCSV: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  datasetName,
  totalLeads,
  pendingSuggestionsCount,
  activeRulesCount,
  showFiltersBar,
  onToggleFiltersBar,
  onFileUpload,
  onOpenMapper,
  onOpenSmartMerge,
  onExportCSV,
  onResetDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F4F6FA]/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Dashboard Title & Action Pills (SaaS Reference Layout) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2.5 pr-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Generación de Demanda B2B
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> {totalLeads} prospectos
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                 Fuente activa: <span className="font-medium text-slate-700">{datasetName}</span>
              </p>
            </div>
          </div>

          {/* Upload CSV Button (+ Add Block style from reference) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50/80 text-blue-600 font-semibold text-xs sm:text-sm border border-blue-200/80 shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Subir CSV</span>
          </button>

          {/* Filter toggle pill */}
          <button
            onClick={onToggleFiltersBar}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border shadow-sm transition-all cursor-pointer ${
              showFiltersBar
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>

          {/* Smart Merge / Data Normalization Button */}
          <button
            onClick={onOpenSmartMerge}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50/70 text-slate-800 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart Merge</span>
            {pendingSuggestionsCount > 0 ? (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingSuggestionsCount} sugerencias
              </span>
            ) : activeRulesCount > 0 ? (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeRulesCount} reglas
              </span>
            ) : null}
          </button>

          {/* Column Mapper Button */}
          <button
            onClick={onOpenMapper}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <Columns className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Mapeo de Columnas</span>
            <span className="lg:hidden">Mapeo</span>
          </button>
        </div>

        {/* Right: Utility & Export actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetDemo}
            title="Restaurar dataset de demostración inicial"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-medium border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Datos Demo</span>
          </button>

          <button
            onClick={handleFullScreen}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Full Screen</span>
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
