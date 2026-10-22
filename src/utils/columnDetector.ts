import { ColumnMapping, LeadRecord, QualificationStatus } from '../types/dashboard';

const COLUMN_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
  empresa: [/empresa/i, /company/i, /cuenta/i, /account/i, /organiza/i, /cliente/i, /nombre.*empresa/i],
  pais: [/pa[ií]s/i, /country/i, /ubicaci[oó]n/i, /region/i, /mercado/i, /location/i],
  industria: [/industria/i, /industry/i, /sector/i, /vertical/i, /rubro/i, /giro/i, /categor[ií]a/i],
  cargo: [/cargo/i, /title/i, /puesto/i, /rol/i, /posici[oó]n/i, /job/i, /ocupaci[oó]n/i],
  campana: [/campa[ñn]a/i, /campaign/i, /canal/i, /sdr/i, /ejecutivo/i, /origen/i, /source/i],
  fechaEjecucion: [/fecha.*ejecuci[oó]n/i, /execution.*date/i, /fecha.*env[ií]o/i, /fecha.*contacto/i, /created/i, /^fecha$/i, /date/i],
  aceptado: [/aceptad[oa]/i, /accepted/i, /invitaci[oó]n.*aceptada/i, /conectado/i, /connected/i, /aceptaci[oó]n/i],
  respondio: [/respondi[oó]/i, /replied/i, /respuesta/i, /response/i, /contest[oó]/i],
  interesado: [/interesad[oa]/i, /interested/i, /^inter[eé]s$/i, /lead.*positivo/i, /oportunidad/i],
  fechaInteres: [/fecha.*inter[eé]s/i, /interest.*date/i, /fecha.*respuesta/i, /fecha.*lead/i],
  reunionAgendada: [/reuni[oó]n.*agendada/i, /meeting.*booked/i, /^reuni[oó]n$/i, /agendad[oa]/i, /cita/i, /meeting/i],
  fechaReunion: [/fecha.*reuni[oó]n/i, /meeting.*date/i, /fecha.*cita/i, /fecha.*agenda/i],
  calificacion: [/calificaci[oó]n/i, /qualified/i, /estado.*reuni[oó]n/i, /estatus.*reuni[oó]n/i, /evaluaci[oó]n/i, /calificad[oa]/i],
  feedback: [/feedback/i, /comentario/i, /notas/i, /observaci[oó]n/i, /notes/i, /detalle.*reuni[oó]n/i],
};

export function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    empresa: '',
    pais: '',
    industria: '',
    cargo: '',
    campana: '',
    fechaEjecucion: '',
    aceptado: '',
    respondio: '',
    interesado: '',
    fechaInteres: '',
    reunionAgendada: '',
    fechaReunion: '',
    calificacion: '',
    feedback: '',
  };

  const usedHeaders = new Set<string>();

  // Priority pass: match specific composite fields first (like fechaInteres, fechaReunion, fechaEjecucion)
  const orderedKeys: (keyof ColumnMapping)[] = [
    'empresa',
    'pais',
    'industria',
    'cargo',
    'campana',
    'fechaInteres',
    'fechaReunion',
    'fechaEjecucion',
    'aceptado',
    'respondio',
    'interesado',
    'reunionAgendada',
    'calificacion',
    'feedback',
  ];

  for (const key of orderedKeys) {
    const patterns = COLUMN_PATTERNS[key];
    for (const pattern of patterns) {
      const match = headers.find((h) => !usedHeaders.has(h) && pattern.test(h.trim()));
      if (match) {
        mapping[key] = match;
        usedHeaders.add(match);
        break;
      }
    }
  }

  return mapping;
}

export function parseTruthyValue(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  const s = String(val).trim().toLowerCase();
  if (!s) return false;
  if (['no', 'false', '0', 'n', 'rechazado', 'none', 'null', 'n/a', '-'].includes(s)) {
    return false;
  }
  if (['sí', 'si', 'yes', 'true', '1', 'y', 's', 'ok', 'aceptado', 'agendada', 'interesado', 'respondió', 'respondio'].includes(s)) {
    return true;
  }
  // If it's a valid date string in a date/status column, treat as true
  if (/^\d{4}-\d{2}-\d{2}/.test(s) || /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(s)) {
    return true;
  }
  return false;
}

export function normalizeDateString(val: unknown): string {
  if (!val) return '';
  const raw = String(val).trim();
  if (!raw) return '';

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return '';
}

export function parseQualificationStatus(val: unknown): QualificationStatus {
  if (!val) return 'Pendiente';
  const s = String(val).trim().toLowerCase();
  if (!s || s === 'pendiente' || s === 'pending' || s === 'sin calificar' || s === '-') {
    return 'Pendiente';
  }
  if (s.includes('descalificad') || s.includes('disqualif') || s.includes('no califica') || s === 'no' || s === 'rechazada') {
    return 'Descalificada';
  }
  if (s.includes('calificad') || s.includes('qualif') || s === 'sí' || s === 'si' || s === 'yes' || s === 'aprobada') {
    return 'Calificada';
  }
  return 'Pendiente';
}

export function buildLeadsFromRawRows(
  rows: Record<string, unknown>[],
  mapping: ColumnMapping
): LeadRecord[] {
  return rows
    .filter((row) => {
      const hasAnyValue = Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== '');
      return hasAnyValue;
    })
    .map((row, idx) => {
      const empresa = String(row[mapping.empresa] ?? `Empresa #${idx + 1}`).trim() || `Empresa #${idx + 1}`;
      const pais = String(row[mapping.pais] ?? 'Sin especificar').trim() || 'Sin especificar';
      const industriaRaw = String(row[mapping.industria] ?? 'General').trim() || 'General';
      const cargoRaw = String(row[mapping.cargo] ?? 'Ejecutivo').trim() || 'Ejecutivo';
      const campana = mapping.campana ? String(row[mapping.campana] ?? 'General').trim() || 'General' : 'Campaña General';

      const fechaEjecucion = normalizeDateString(row[mapping.fechaEjecucion]) || '2026-09-15';
      const fechaInteres = normalizeDateString(row[mapping.fechaInteres]);
      const fechaReunion = normalizeDateString(row[mapping.fechaReunion]);

      const interesado = mapping.interesado
        ? parseTruthyValue(row[mapping.interesado]) || Boolean(fechaInteres)
        : Boolean(fechaInteres);

      const reunionAgendada = mapping.reunionAgendada
        ? parseTruthyValue(row[mapping.reunionAgendada]) || Boolean(fechaReunion)
        : Boolean(fechaReunion);

      const respondio = mapping.respondio
        ? parseTruthyValue(row[mapping.respondio]) || interesado || reunionAgendada
        : interesado || reunionAgendada;

      const aceptado = mapping.aceptado
        ? parseTruthyValue(row[mapping.aceptado]) || respondio
        : respondio;

      const calificacion = parseQualificationStatus(row[mapping.calificacion]);
      const feedback = mapping.feedback ? String(row[mapping.feedback] ?? '').trim() : '';

      return {
        id: String(row['ID'] ?? row['id'] ?? `LD-${1001 + idx}`),
        empresa,
        pais,
        industriaOriginal: industriaRaw,
        industria: industriaRaw,
        cargoOriginal: cargoRaw,
        cargo: cargoRaw,
        campana,
        fechaEjecucion,
        aceptado,
        respondio,
        interesado,
        fechaInteres: interesado ? (fechaInteres || fechaEjecucion) : '',
        reunionAgendada,
        fechaReunion: reunionAgendada ? (fechaReunion || fechaInteres || fechaEjecucion) : '',
        calificacion,
        feedback,
      };
    });
}
