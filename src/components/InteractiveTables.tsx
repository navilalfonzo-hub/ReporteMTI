import React, { useState } from 'react';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquarePlus,
  Check,
  Clock,
  Search,
  CalendarPlus,
} from 'lucide-react';
import { LeadRecord, QualificationStatus } from '../types/dashboard';

interface InteractiveTablesProps {
  leads: LeadRecord[];
  onUpdateMeetingFeedback: (
    leadId: string,
    calificacion: QualificationStatus,
    feedback: string
  ) => void;
  onPromoteToMeeting: (leadId: string) => void;
}

export const InteractiveTables: React.FC<InteractiveTablesProps> = ({
  leads,
  onUpdateMeetingFeedback,
  onPromoteToMeeting,
}) => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'interested'>('meetings');
  const [meetingFilter, setMeetingFilter] = useState<'ALL' | QualificationStatus>('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const [draftFeedbacks, setDraftFeedbacks] = useState<Record<string, string>>({});
  const [savedToastId, setSavedToastId] = useState<string | null>(null);

  const meetingsLeads = leads.filter((l) => l.reunionAgendada);
  const interestedLeads = leads.filter((l) => l.interesado);

  const pendingCount = meetingsLeads.filter((l) => l.calificacion === 'Pendiente').length;
  const qualifiedCount = meetingsLeads.filter((l) => l.calificacion === 'Calificada').length;
  const disqualifiedCount = meetingsLeads.filter((l) => l.calificacion === 'Descalificada').length;

  const filteredMeetings = meetingsLeads.filter((m) => {
    if (meetingFilter !== 'ALL' && m.calificacion !== meetingFilter) return false;
    if (tableSearch.trim() !== '') {
      const q = tableSearch.toLowerCase();
      return (
        m.empresa.toLowerCase().includes(q) ||
        m.pais.toLowerCase().includes(q) ||
        m.cargo.toLowerCase().includes(q) ||
        m.industria.toLowerCase().includes(q) ||
        m.feedback.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredInterested = interestedLeads.filter((item) => {
    if (tableSearch.trim() !== '') {
      const q = tableSearch.toLowerCase();
      return (
        item.empresa.toLowerCase().includes(q) ||
        item.pais.toLowerCase().includes(q) ||
        item.cargo.toLowerCase().includes(q) ||
        item.industria.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const triggerSavedIndicator = (id: string) => {
    setSavedToastId(id);
    setTimeout(() => {
      setSavedToastId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const handleStatusToggle = (lead: LeadRecord, newStatus: QualificationStatus) => {
    const currentText = draftFeedbacks[lead.id] ?? lead.feedback;
    onUpdateMeetingFeedback(lead.id, newStatus, currentText);
    triggerSavedIndicator(lead.id);
  };

  const handleFeedbackSave = (lead: LeadRecord) => {
    const text = (draftFeedbacks[lead.id] ?? lead.feedback).trim();
    // If the user enters textual feedback while status is 'Pendiente', keep current status or allow them to click Calificada/Descalificada
    onUpdateMeetingFeedback(lead.id, lead.calificacion, text);
    triggerSavedIndicator(lead.id);
  };

  return (
    <section className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Top Bar: Tabs + Quick Filters + Search */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 bg-slate-50/40">
        {/* Main Table Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('meetings')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'meetings'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Lista de Reuniones Agendadas</span>
            <span
              className={`px-2 py-0.2 rounded-full text-xs ${
                activeTab === 'meetings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {meetingsLeads.length}
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.2 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                {pendingCount} sin calificar
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('interested')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'interested'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lista de Interesados</span>
            <span
              className={`px-2 py-0.2 rounded-full text-xs ${
                activeTab === 'interested' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {interestedLeads.length}
            </span>
          </button>
        </div>

        {/* Right: Status Filter Pills (for Meetings) + Table Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'meetings' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
              {(
                [
                  { id: 'ALL', label: `Todas (${meetingsLeads.length})` },
                  { id: 'Pendiente', label: `Pendientes (${pendingCount})` },
                  { id: 'Calificada', label: `Calificadas (${qualifiedCount})` },
                  { id: 'Descalificada', label: `Descalificadas (${disqualifiedCount})` },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setMeetingFilter(pill.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    meetingFilter === pill.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filtrar en esta tabla..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* TABLE A: LISTA DE REUNIONES AGENDADAS */}
      {activeTab === 'meetings' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5">Empresa</th>
                <th className="py-3.5 px-4">País</th>
                <th className="py-3.5 px-4">Cargo</th>
                <th className="py-3.5 px-4">Fecha de Ejecución</th>
                <th className="py-3.5 px-5 min-w-[420px]">
                  Calificación & Feedback de Reunión (Interactivo en Vivo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                    No se encontraron reuniones agendadas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((lead) => {
                  const isPending = lead.calificacion === 'Pendiente';
                  const currentFeedbackValue = draftFeedbacks[lead.id] ?? lead.feedback;
                  const isModified =
                    draftFeedbacks[lead.id] !== undefined && draftFeedbacks[lead.id] !== lead.feedback;

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        isPending ? 'bg-amber-50/25 hover:bg-amber-50/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Empresa */}
                      <td className="py-3.5 px-5 align-top">
                        <div className="font-bold text-slate-900">{lead.empresa}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {lead.industria}
                        </span>
                      </td>

                      {/* País */}
                      <td className="py-3.5 px-4 align-top font-medium text-slate-700">
                        {lead.pais}
                      </td>

                      {/* Cargo */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-slate-800">{lead.cargo}</div>
                        {lead.cargoOriginal !== lead.cargo && (
                          <div className="text-[11px] text-slate-400">
                            Orig: {lead.cargoOriginal}
                          </div>
                        )}
                      </td>

                      {/* Fecha de Ejecución */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-slate-800">{lead.fechaEjecucion}</div>
                        {lead.fechaReunion && (
                          <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                            Cita: {lead.fechaReunion}
                          </div>
                        )}
                      </td>

                      {/* Gestión de Feedback (Toggle Calificada / Descalificada + Campo de texto integrable) */}
                      <td className="py-3.5 px-5 align-top">
                        <div className="flex flex-col gap-2.5">
                          {/* Row 1: Prominent Qualification Buttons / Toggle */}
                          <div className="flex flex-wrap items-center gap-2">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <Clock className="w-3 h-3" /> Requiere Calificación:
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleStatusToggle(lead, 'Calificada')}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                lead.calificacion === 'Calificada'
                                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                                  : isPending
                                  ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-2 border-emerald-400 shadow-xs'
                                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Calificada</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusToggle(lead, 'Descalificada')}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                lead.calificacion === 'Descalificada'
                                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20 ring-2 ring-rose-500/30'
                                  : isPending
                                  ? 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border-2 border-rose-300 shadow-xs'
                                  : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Descalificada</span>
                            </button>

                            {savedToastId === lead.id && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 animate-fade-in">
                                <Check className="w-3.5 h-3.5" /> KPI actualizado
                              </span>
                            )}
                          </div>

                          {/* Row 2: Integrated Text Feedback Input */}
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <MessageSquarePlus className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={currentFeedbackValue}
                                onChange={(e) =>
                                  setDraftFeedbacks((prev) => ({
                                    ...prev,
                                    [lead.id]: e.target.value,
                                  }))
                                }
                                onBlur={() => {
                                  if (isModified) handleFeedbackSave(lead);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.currentTarget.blur();
                                    handleFeedbackSave(lead);
                                  }
                                }}
                                placeholder="Ingresar feedback cualitativo de la reunión (presiona Enter para guardar)..."
                                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                  currentFeedbackValue
                                    ? 'bg-white border-slate-200 text-slate-800 font-medium'
                                    : 'bg-amber-50/40 border-amber-200/90 text-slate-700 placeholder:text-slate-400'
                                }`}
                              />
                            </div>
                            {isModified && (
                              <button
                                type="button"
                                onClick={() => handleFeedbackSave(lead)}
                                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                              >
                                Guardar
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE B: LISTA DE INTERESADOS */}
      {activeTab === 'interested' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5">Empresa</th>
                <th className="py-3.5 px-4">País</th>
                <th className="py-3.5 px-4">Cargo</th>
                <th className="py-3.5 px-4">Fecha de Ejecución</th>
                <th className="py-3.5 px-4">Fecha de Interés</th>
                <th className="py-3.5 px-5 text-right">Estatus de Reunión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredInterested.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                    No se encontraron prospectos interesados con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredInterested.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{lead.empresa}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                        {lead.industria}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{lead.pais}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{lead.cargo}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{lead.fechaEjecucion}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs">
                        {lead.fechaInteres || lead.fechaEjecucion}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {lead.reunionAgendada ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reunión Agendada ({lead.calificacion})
                        </span>
                      ) : (
                        <button
                          onClick={() => onPromoteToMeeting(lead.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          <span>Agendar Reunión</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
