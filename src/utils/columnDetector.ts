import { ColumnMapping, EtapaComercialStatus, EtapaMTIStatus, LeadRecord } from '../types/dashboard';

export const COLUMN_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
  pais: [/pa[ií]s.*lead/i, /pa[ií]s/i, /country/i, /ubicaci[oó]n/i],
  fechaEnvioConexion: [/fecha.*enviada.*conexi[oó]n/i, /fecha.*env[ií]o/i, /fecha.*conexi[oó]n/i, /^fecha\s*enviada/i],
  empresa: [/^empresa$/i, /company/i, /organiza/i, /cuenta/i],
  tamanoEmpresa: [/tama[ñn]o.*empresa/i, /company.*size/i, /empleados/i, /tama[ñn]o/i],
  industria: [/industria.*empresa/i, /industria/i, /industry/i, /sector/i, /rubro/i],
  linkedin: [/linkedin.*persona/i, /linkedin/i, /url.*perfil/i],
  nombre: [/^nombre$/i, /nombre.*contacto/i, /full.*name/i, /persona/i],
  cargo: [/^cargo$/i, /puesto/i, /job.*title/i, /rol/i, /posici[oó]n/i],
  estado1Acepto: [/estado\s*1/i, /acept[oó].*conexi[oó]n/i, /invitaci[oó]n.*aceptada/i, /^aceptad[oa]$/i],
  estado2Intereso: [/estado\s*2/i, /se\s*interes[oó]/i, /^interesad[oa]$/i],
  estado3Reunion: [/estado\s*3/i, /di[oó]\s*reuni[oó]n/i, /reuni[oó]n.*agendada/i],
  fechaAceptacion: [/fecha.*aceptaci[oó]n/i, /acceptance.*date/i],
  respuestaContacto: [/respuesta.*contacto/i, /^respuesta/i, /replied/i, /mensaje.*respuesta/i],
  fechaInteresado: [/fecha.*interesado/i, /fecha.*inter[eé]s/i],
  fechaConfirmacionReunion: [/fecha.*confirmaci[oó]n.*reuni[oó]n/i, /fecha.*confirmaci[oó]n/i],
  fechaEjecucionReunion: [/fecha.*ejecuci[oó]n.*reuni[oó]n/i, /fecha.*ejecuci[oó]n/i, /fecha.*reuni[oó]n/i],
  feedbackReunion: [/feedback.*reuni[oó]n/i, /feedback/i, /comentarios/i, /notas/i],
  etapaMTI: [/etapa.*mti/i, /califica.*no\s*califica/i, /calificaci[oó]n.*reuni[oó]n/i, /calificaci[oó]n/i],
  etapaComercial: [/etapa.*comercial/i, /pipeline.*presupuesto/i, /estatus.*comercial/i],
};

export function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    pais: '',
    fechaEnvioConexion: '',
    empresa: '',
    tamanoEmpresa: '',
    industria: '',
    linkedin: '',
    nombre: '',
    cargo: '',
    estado1Acepto: '',
    estado2Intereso: '',
    estado3Reunion: '',
    fechaAceptacion: '',
    respuestaContacto: '',
    fechaInteresado: '',
    fechaConfirmacionReunion: '',
    fechaEjecucionReunion: '',
    feedbackReunion: '',
    etapaMTI: '',
    etapaComercial: '',
  };

  const used = new Set<string>();
  const orderedKeys: (keyof ColumnMapping)[] = [
    'pais',
    'fechaEnvioConexion',
    'tamanoEmpresa',
    'industria',
    'empresa',
    'linkedin',
    'nombre',
    'cargo',
    'estado1Acepto',
    'estado2Intereso',
    'estado3Reunion',
    'fechaAceptacion',
    'respuestaContacto',
    'fechaInteresado',
    'fechaConfirmacionReunion',
    'fechaEjecucionReunion',
    'feedbackReunion',
    'etapaMTI',
    'etapaComercial',
  ];

  for (const key of orderedKeys) {
    for (const rx of COLUMN_PATTERNS[key]) {
      const match = headers.find((h) => !used.has(h) && rx.test(h.trim()));
      if (match) {
        mapping[key] = match;
        used.add(match);
        break;
      }
    }
  }

  return mapping;
}

export function parseTruthyValue(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  const s = String(val).trim().toLowerCase();
  if (!s || ['no', 'false', '0', 'n', 'rechazado', 'none', 'null', 'n/a', '-', 'no califica'].includes(s)) {
    return false;
  }
  if (['sí', 'si', 'yes', 'true', '1', 'y', 's', 'ok', 'aceptado', 'aceptó', 'acepto', 'interesado', 'agendada', 'dió reunión', 'dio reunion'].includes(s)) {
    return true;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s) || /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(s)) {
    return true;
  }
  return false;
}

export function normalizeDateString(val: unknown): string {
  if (!val) return '';
  const raw = String(val).trim();
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return '';
}

export function parseEtapaMTI(val: unknown): EtapaMTIStatus {
  if (!val) return 'Pendiente';
  const s = String(val).trim().toLowerCase();
  if (!s || s === 'pendiente' || s === 'pending' || s === '-') return 'Pendiente';
  if (s.includes('no califica') || s.includes('descalificad') || s === 'no' || s === 'rechazada') {
    return 'No califica';
  }
  if (s.includes('califica') || s === 'sí' || s === 'si' || s === 'aprobada') {
    return 'Califica';
  }
  return 'Pendiente';
}

export function parseEtapaComercial(val: unknown): EtapaComercialStatus {
  if (!val) return 'Sin etapa';
  const s = String(val).trim().toLowerCase();
  if (s.includes('ganad') || s.includes('won') || s.includes('cerrad')) return 'Ganada';
  if (s.includes('perdid') || s.includes('lost') || s.includes('descart')) return 'Perdida';
  if (s.includes('presupuesto') || s.includes('propuesta') || s.includes('cotiza') || s.includes('budget')) return 'Presupuesto';
  if (s.includes('pipeline') || s.includes(' descubrimiento') || s.includes('proceso') || s.includes('activa')) return 'Pipeline';
  return 'Sin etapa';
}

export function buildLeadsFromRawRows(
  rows: Record<string, unknown>[],
  mapping: ColumnMapping
): LeadRecord[] {
  return rows
    .filter((row) => Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== ''))
    .map((row, idx) => {
      const pais = String(row[mapping.pais] ?? 'Sin especificar').trim() || 'Sin especificar';
      const fechaEnvioConexion = normalizeDateString(row[mapping.fechaEnvioConexion]) || '2026-10-01';
      const empresa = String(row[mapping.empresa] ?? `Empresa #${idx + 1}`).trim() || `Empresa #${idx + 1}`;
      const tamanoEmpresa = String(row[mapping.tamanoEmpresa] ?? 'No especificado').trim() || 'No especificado';
      const industriaRaw = String(row[mapping.industria] ?? 'General').trim() || 'General';
      const linkedin = String(row[mapping.linkedin] ?? '').trim();
      const nombre = String(row[mapping.nombre] ?? `Contacto #${idx + 1}`).trim() || `Contacto #${idx + 1}`;
      const cargoRaw = String(row[mapping.cargo] ?? 'Ejecutivo').trim() || 'Ejecutivo';

      const fechaAceptacion = normalizeDateString(row[mapping.fechaAceptacion]);
      const respuestaContacto = String(row[mapping.respuestaContacto] ?? '').trim();
      const fechaInteresado = normalizeDateString(row[mapping.fechaInteresado]);
      const fechaConfirmacionReunion = normalizeDateString(row[mapping.fechaConfirmacionReunion]);
      const fechaEjecucionReunion = normalizeDateString(row[mapping.fechaEjecucionReunion]);

      const estado3Reunion = mapping.estado3Reunion
        ? parseTruthyValue(row[mapping.estado3Reunion]) || Boolean(fechaConfirmacionReunion) || Boolean(fechaEjecucionReunion)
        : Boolean(fechaConfirmacionReunion) || Boolean(fechaEjecucionReunion);

      const estado2Intereso = mapping.estado2Intereso
        ? parseTruthyValue(row[mapping.estado2Intereso]) || Boolean(fechaInteresado) || estado3Reunion
        : Boolean(fechaInteresado) || estado3Reunion;

      const estado1Acepto = mapping.estado1Acepto
        ? parseTruthyValue(row[mapping.estado1Acepto]) || Boolean(fechaAceptacion) || Boolean(respuestaContacto) || estado2Intereso
        : Boolean(fechaAceptacion) || Boolean(respuestaContacto) || estado2Intereso;

      const feedbackReunion = String(row[mapping.feedbackReunion] ?? '').trim();
      const etapaMTI = parseEtapaMTI(row[mapping.etapaMTI]);
      const etapaComercial = parseEtapaComercial(row[mapping.etapaComercial]);

      return {
        id: String(row['ID'] ?? row['id'] ?? `LD-${1001 + idx}`),
        pais,
        fechaEnvioConexion,
        empresa,
        tamanoEmpresa,
        industriaOriginal: industriaRaw,
        industria: industriaRaw,
        linkedin,
        nombre,
        cargoOriginal: cargoRaw,
        cargo: cargoRaw,
        estado1Acepto,
        estado2Intereso,
        estado3Reunion,
        fechaAceptacion: estado1Acepto ? (fechaAceptacion || fechaEnvioConexion) : '',
        respuestaContacto,
        fechaInteresado: estado2Intereso ? (fechaInteresado || fechaAceptacion || fechaEnvioConexion) : '',
        fechaConfirmacionReunion: estado3Reunion ? (fechaConfirmacionReunion || fechaInteresado || fechaEnvioConexion) : '',
        fechaEjecucionReunion: estado3Reunion ? (fechaEjecucionReunion || fechaConfirmacionReunion || fechaEnvioConexion) : '',
        feedbackReunion,
        etapaMTI,
        etapaComercial: estado3Reunion && etapaComercial === 'Sin etapa' ? 'Pipeline' : etapaComercial,
      };
    });
}
