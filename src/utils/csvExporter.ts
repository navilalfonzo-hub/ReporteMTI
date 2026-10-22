import { LeadRecord } from '../types/dashboard';

export function exportLeadsToCSV(leads: LeadRecord[], filename = 'reporte_mti_normalizado.csv'): void {
  const headers = [
    'ID',
    'Empresa',
    'Pais',
    'Industria_Normalizada',
    'Industria_Original',
    'Cargo_Normalizado',
    'Cargo_Original',
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
  ];

  const escapeCsvCell = (val: unknown): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = leads.map((l) => [
    l.id,
    l.empresa,
    l.pais,
    l.industria,
    l.industriaOriginal,
    l.cargo,
    l.cargoOriginal,
    l.campana,
    l.fechaEjecucion,
    l.aceptado ? 'Sí' : 'No',
    l.respondio ? 'Sí' : 'No',
    l.interesado ? 'Sí' : 'No',
    l.fechaInteres,
    l.reunionAgendada ? 'Sí' : 'No',
    l.fechaReunion,
    l.reunionAgendada ? l.calificacion : '',
    l.feedback,
  ]);

  const csvString =
    '\uFEFF' + // UTF-8 BOM for Excel compatibility
    [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\r\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
