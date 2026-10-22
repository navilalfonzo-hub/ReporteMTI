import React, { useState } from 'react';
import { Columns, CheckCircle2, X, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { ColumnMapping } from '../types/dashboard';

interface ColumnMapperModalProps {
  isOpen: boolean;
  headers: string[];
  sampleRow?: Record<string, unknown>;
  initialMapping: ColumnMapping;
  onConfirm: (mapping: ColumnMapping, openSmartMergeNext: boolean) => void;
  onClose: () => void;
}

const FIELD_DEFINITIONS: {
  key: keyof ColumnMapping;
  label: string;
  description: string;
  required?: boolean;
  kpiTag?: string;
}[] = [
  { key: 'empresa', label: 'Empresa / Cuenta', description: 'Nombre de la organización prospectada', required: true },
  { key: 'pais', label: 'País / Región', description: 'Ubicación geográfica del prospecto', required: true },
  { key: 'industria', label: 'Industria / Sector', description: 'Vertical de negocio (se normalizará en Smart Merge)', required: true },
  { key: 'cargo', label: 'Cargo / Posición', description: 'Rol del contacto dentro de la empresa', required: true },
  { key: 'fechaEjecucion', label: 'Fecha de Ejecución', description: 'Fecha de contacto o envío de campaña', required: true },
  { key: 'aceptado', label: 'Invitación Aceptada', description: 'Estado booleano (Sí/No) o fecha de aceptación', kpiTag: 'KPI 1: Tasa Aceptación' },
  { key: 'respondio', label: 'Respondió Contacto', description: 'Indica si el prospecto respondió el mensaje', kpiTag: 'KPI 2: Tasa Respuesta' },
  { key: 'interesado', label: 'Prospecto Interesado', description: 'Marca si el lead mostró interés comercial', kpiTag: 'KPI 3: Conversión Citas' },
  { key: 'fechaInteres', label: 'Fecha de Interés', description: 'Fecha en la que se registró el interés (Tabla Interesados)' },
  { key: 'reunionAgendada', label: 'Reunión Agendada', description: 'Indica si se concretó una cita comercial', kpiTag: 'KPI 3 & 4: Reuniones' },
  { key: 'fechaReunion', label: 'Fecha de Reunión', description: 'Fecha programada para la sesión comercial' },
  { key: 'calificacion', label: 'Calificación de Reunión', description: 'Calificada / Descalificada / Vacío (Pendiente)', kpiTag: 'KPI 4: Tasa Calificación' },
  { key: 'feedback', label: 'Feedback de Reunión', description: 'Comentarios cualitativos del ejecutivo comercial' },
  { key: 'campana', label: 'Campaña / Origen (Opcional)', description: 'Nombre de la campaña o secuencia outbound' },
];

export const ColumnMapperModal: React.FC<ColumnMapperModalProps> = ({
  isOpen,
  headers,
  sampleRow,
  initialMapping,
  onConfirm,
  onClose,
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping);
  const [openSmartMergeNext, setOpenSmartMergeNext] = useState(true);

  if (!isOpen) return null;

  const handleSelect = (key: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [key]: value }));
  };

  const detectedCount = Object.values(mapping).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Columns className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Detección Automática y Mapeo de Columnas CSV</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {detectedCount} de {FIELD_DEFINITIONS.length} detectadas
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Hemos analizado la estructura de tu archivo CSV y sugerido el mapeo óptimo para calcular los 4 KPIs comerciales.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mapping Grid */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FIELD_DEFINITIONS.map((field) => {
              const selectedHeader = mapping[field.key];
              const sampleVal =
                selectedHeader && sampleRow ? String(sampleRow[selectedHeader] ?? '').slice(0, 42) : '';

              return (
                <div
                  key={field.key}
                  className={`p-3.5 rounded-2xl border transition-all bg-white ${
                    selectedHeader ? 'border-blue-200/90 shadow-sm' : 'border-slate-200/80 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{field.label}</span>
                      {field.required && <span className="text-rose-500 text-xs font-bold">*</span>}
                    </div>
                    {field.kpiTag && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                        {field.kpiTag}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2.5">{field.description}</p>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedHeader}
                      onChange={(e) => handleSelect(field.key, e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        selectedHeader
                          ? 'bg-blue-50/50 border-blue-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <option value="">-- No mapear / Columna ausente --</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedHeader && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Mapeado
                      </span>
                      <span className="truncate max-w-[180px]" title={sampleVal}>
                        Ej: <strong className="text-slate-700">{sampleVal || '(vacío en fila 1)'}</strong>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openSmartMergeNext}
              onChange={(e) => setOpenSmartMergeNext(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Abrir módulo de Validación y Normalización (Smart Merge) al continuar</span>
          </label>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(mapping, openSmartMergeNext)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Confirmar Mapeo y Procesar Datos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
