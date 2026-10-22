import { LeadRecord } from '../types/dashboard';

export function exportLeadsToCSV(leads: LeadRecord[], filename = 'base_mti_procesada_y_actualizada.csv'): void {
  const headers = [
    'País del lead',
    'Fecha Enviada envío de conexion',
    'Empresa',
    'Tamaño de la empresa',
    'Industria de la empresa',
    'Industria Original',
    'LinkedIn de la persona',
    'Nombre',
    'Cargo',
    'Cargo Original',
    'Estado 1 si aceptó la conexión',
    'Estado 2 si se interesó o no',
    'Estado 3 si dió reunión',
    'FECHA DE ACEPTACIÓN',
    'RESPUESTA que dió el contacto',
    'FECHA DE INTERESADO',
    'FECHA DE CONFIRMACION DE REUNION',
    'Fecha de ejecucion de la reunion',
    'Feedback Reunión',
    'Etapa MTI',
    'Etapa Comercial',
  ];

  const escapeCsvCell = (val: unknown): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = leads.map((l) => [
    l.pais,
    l.fechaEnvioConexion,
    l.empresa,
    l.tamanoEmpresa,
    l.industria,
    l.industriaOriginal,
    l.linkedin,
    l.nombre,
    l.cargo,
    l.cargoOriginal,
    l.estado1Acepto ? 'Sí' : 'No',
    l.estado2Intereso ? 'Sí' : 'No',
    l.estado3Reunion ? 'Sí' : 'No',
    l.fechaAceptacion,
    l.respuestaContacto,
    l.fechaInteresado,
    l.fechaConfirmacionReunion,
    l.fechaEjecucionReunion,
    l.feedbackReunion,
    l.estado3Reunion ? l.etapaMTI : '',
    l.estado3Reunion ? l.etapaComercial : '',
  ]);

  const csvString =
    '\uFEFF' +
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
