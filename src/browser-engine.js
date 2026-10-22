// ============================================================================
// MTI ANALYTICS B2B - CORE DATA, SMART MERGE, KPI & HD EXPORT ENGINE
// ============================================================================
(function () {
  const SAMPLE_CSV_CONTENT = `País del lead,Fecha Enviada envío de conexion,Empresa,Tamaño de la empresa,Industria de la empresa,LinkedIn de la persona,Nombre,Cargo,Estado 1 si aceptó la conexión,Estado 2 si se interesó o no,Estado 3 si dió reunión,FECHA DE ACEPTACIÓN,RESPUESTA que dió el contacto,FECHA DE INTERESADO,FECHA DE CONFIRMACION DE REUNION,Fecha de ejecucion de la reunion,Feedback Reunión,Etapa MTI,Etapa Comercial
México,2026-09-18,Grupo Financiero Azteca,1001-5000 empleados,Banca,https://linkedin.com/in/carlos-mendoza-fin,Carlos Mendoza,Director Comercial,Sí,Sí,Sí,2026-09-19,Me interesa conocer cómo automatizan la prospección B2B regional,2026-09-20,2026-09-21,2026-09-24,Presupuesto aprobado para Q4. Buscan escalar prospección con 15 SDRs.,Califica,Presupuesto
España,2026-09-19,BBVA Corporate Solutions,+5000 empleados,banking,https://linkedin.com/in/elena-rodriguez-vp,Elena Rodríguez,VP de Ventas,Sí,Sí,Sí,2026-09-20,Claro agendemos una llamada el martes para revisar el alcance,2026-09-21,2026-09-22,2026-09-25,Excelente fit técnico. Solicitaron propuesta comercial para 3 unidades de negocio.,Califica,Ganada
Colombia,2026-09-21,Bancolombia Inversiones,1001-5000 empleados,Servicios Financieros,https://linkedin.com/in/andres-restrepo-mkt,Andrés Restrepo,Gerente de Marketing,Sí,Sí,Sí,2026-09-22,Sí me gustaría ver una demo enfocada en banca corporativa,2026-09-23,2026-09-25,2026-10-16,,,Pipeline
Perú,2026-09-22,Banco de Crédito BCP,+5000 empleados,banca,https://linkedin.com/in/valeria-silva-cmo,Valeria Silva,CMO,Sí,Sí,No,2026-09-23,Envíame información por correo primero por favor,2026-09-24,,,,,
Chile,2026-09-24,Santander Digital Tech,501-1000 empleados,Fintech & Banking,https://linkedin.com/in/rodrigo-lagos-cto,Rodrigo Lagos,Director de Tecnología,Sí,Sí,Sí,2026-09-25,Revisemos la integración con nuestro CRM corporativo la próxima semana,2026-09-26,2026-09-28,2026-10-02,Interesados en integración API con su CRM. Demo técnica agendada con arquitectura.,Califica,Presupuesto
México,2026-09-25,Nemak Automotive Components,+5000 empleados,manufactura automotriz,https://linkedin.com/in/jorge-garza-planta,Jorge Garza,Director de Planta,Sí,Sí,Sí,2026-09-26,Tenemos iniciativa de digitalización comercial este trimestre,2026-09-27,2026-09-29,2026-10-17,,,Pipeline
México,2026-09-27,Grupo Bimbo Operaciones,+5000 empleados,manufactura de alimentos,https://linkedin.com/in/fernanda-lopez-ops,Fernanda López,Gerente de Operaciones,Sí,Sí,Sí,2026-09-28,Coordinemos sesión con el líder de cuentas clave B2B,2026-09-29,2026-10-01,2026-10-04,Necesitan visibilidad de pipeline B2B para distribuidores mayoristas en Norteamérica.,Califica,Presupuesto
Colombia,2026-09-28,Envases Universales S.A.,501-1000 empleados,fabricación de artículos,https://linkedin.com/in/camilo-vargas-dir,Camilo Vargas,Director Comercial,Sí,Sí,Sí,2026-09-29,Podemos conversar el jueves por la mañana,2026-10-02,2026-10-02,2026-10-05,Contrato vigente con proveedor actual hasta mediados del próximo año. Retomar en 6 meses.,No califica,Perdida
México,2026-09-30,Metalsa Estructuras,1001-5000 empleados,manufactura automotriz,https://linkedin.com/in/ricardo-trevino-com,Ricardo Treviño,Gerente Comercial,Sí,Sí,No,2026-10-01,Nos interesa pero estamos en cierre de mes hablemos luego,2026-10-02,,,,,
Perú,2026-10-01,Alicorp Industrial,1001-5000 empleados,manufactura de alimentos,https://linkedin.com/in/diego-paredes-vp,Diego Paredes,VP de Ventas,Sí,Sí,Sí,2026-10-02,Agendemos para revisar indicadores de demanda industrial,2026-10-03,2026-10-05,2026-10-18,,,Pipeline
Colombia,2026-10-02,CloudWare Solutions,201-500 empleados,Software & SaaS,https://linkedin.com/in/santiago-mejia-ceo,Santiago Mejía,CEO,Sí,Sí,Sí,2026-10-03,Excelente timing estamos buscando escalar outbound B2B,2026-10-04,2026-10-05,2026-10-08,Decisor final en la llamada. Quiere arrancar piloto de 60 días de inmediato.,Califica,Ganada
México,2026-10-04,Softtek Enterprise,+5000 empleados,Tecnología de la Información,https://linkedin.com/in/patricia-solis-mkt,Patricia Solís,Director de Marketing B2B,Sí,Sí,Sí,2026-10-05,Me suma mucho ver casos de éxito en sector IT,2026-10-06,2026-10-07,2026-10-10,Buscan escalar generación de demanda en EE.UU. y México para servicios cloud.,Califica,Presupuesto
Argentina,2026-10-05,Globant Digital Studios,+5000 empleados,IT Services,https://linkedin.com/in/martin-acosta-growth,Martín Acosta,Head of Growth & Marketing,Sí,Sí,No,2026-10-06,Mándame el deck ejecutivo para compartirlo con el VP,2026-10-07,,,,,
Chile,2026-10-06,Cencosud Retail Group,+5000 empleados,Retail,https://linkedin.com/in/carolina-munoz-mkt,Carolina Muñoz,Gerente de Marketing,Sí,Sí,Sí,2026-10-07,Conversemos el viernes a las 11am,2026-10-08,2026-10-09,2026-10-12,Equipo comercial B2B menor a 3 personas fuera del ICP enterprise.,No califica,Perdida
Chile,2026-10-07,Falabella Corporativo,+5000 empleados,Comercio Minorista,https://linkedin.com/in/matias-rojas-com,Matías Rojas,Director Comercial,Sí,No,No,2026-10-08,Por ahora no estamos evaluando nuevas herramientas gracias,,,,,,
Argentina,2026-10-08,MercadoLibre B2B Sellers,+5000 empleados,E-commerce & Retail,https://linkedin.com/in/lucas-benitez-sales,Lucas Benítez,Head of Sales,Sí,Sí,Sí,2026-10-09,Sí agendemos reunión para evaluar el módulo analítico,2026-10-10,2026-10-11,2026-10-14,Alto volumen de prospección saliente. Solicitaron cotización anual para 40 licencias.,Califica,Presupuesto
México,2026-10-09,Laboratorios Pisa,1001-5000 empleados,Salud y Farmacéutica,https://linkedin.com/in/gabriela-torres-pharma,Gabriela Torres,Gerente Comercial,Sí,No,No,2026-10-10,,,,,,,
Chile,2026-10-10,Clínica Alemana B2B,1001-5000 empleados,Healthcare,https://linkedin.com/in/sebastian-vera-dir,Sebastián Vera,Director Comercial,Sí,Sí,Sí,2026-10-11,Revisemos cómo aplicarlo a convenios corporativos de salud,2026-10-12,2026-10-14,2026-10-19,,,Pipeline
Colombia,2026-10-11,Sura Seguros y Finanzas,+5000 empleados,Banca,https://linkedin.com/in/natalia-gomez-b2b,Natalia Gómez,Director de Marketing B2B,Sí,Sí,Sí,2026-10-12,De acuerdo tengamos una sesión de 30 minutos,2026-10-13,2026-10-14,2026-10-16,Muy buena recepción del equipo de Growth. Piden segunda sesión con compras.,Califica,Presupuesto
Perú,2026-10-12,Scotiabank Empresas,+5000 empleados,banking,https://linkedin.com/in/alvaro-castro-banca,Álvaro Castro,Gerente Comercial,Sí,Sí,No,2026-10-13,Interesante propuesta te confirmo agenda la próxima semana,2026-10-14,,,,,
Brasil,2026-10-13,Nubank Business,+5000 empleados,Fintech & Banking,https://linkedin.com/in/rafael-souza-sales,Rafael Souza,Head of Sales,Sí,Sí,Sí,2026-10-14,Vamos agendar uma call para ver os relatórios B2B,2026-10-14,2026-10-15,2026-10-17,Interés inmediato en analítica de conversión de campañas B2B.,Califica,Ganada
México,2026-10-14,Arca Continental Bebidas,+5000 empleados,manufactura de alimentos,https://linkedin.com/in/hector-villarreal-com,Héctor Villarreal,Director Comercial,Sí,Sí,Sí,2026-10-15,Claro me interesa ver el alcance para canal institucional,2026-10-15,2026-10-16,2026-10-20,,,Pipeline
Chile,2026-10-15,Cristalerías de Chile,501-1000 empleados,fabricación de artículos,https://linkedin.com/in/paula-contreras-ops,Paula Contreras,Gerente de Operaciones,Sí,Sí,No,2026-10-16,Déjame validarlo con el director comercial primero,2026-10-16,,,,,
México,2026-10-15,Rassini Componentes,1001-5000 empleados,manufactura automotriz,https://linkedin.com/in/arturo-salinas-vp,Arturo Salinas,VP de Ventas,Sí,Sí,Sí,2026-10-16,Perfecto agendemos para este viernes,2026-10-17,2026-10-17,2026-10-19,Proyecto estratégico para digitalizar fuerza de ventas industrial en 2026.,Califica,Presupuesto
México,2026-10-16,Kavak B2B Fleet,1001-5000 empleados,E-commerce & Retail,https://linkedin.com/in/daniel-ortega-fleet,Daniel Ortega,Director Comercial,Sí,Sí,Sí,2026-10-17,Sí veamos cómo optimizar nuestro embudo de flotas para empresas,2026-10-17,2026-10-18,2026-10-20,Prioridades congeladas este trimestre por reestructuración interna.,No califica,Perdida
México,2026-10-17,KIO Networks,1001-5000 empleados,Tecnología de la Información,https://linkedin.com/in/alejandro-ruiz-cto,Alejandro Ruiz,CTO,Sí,Sí,Sí,2026-10-18,Agendado con mi equipo de preventa enterprise,2026-10-18,2026-10-19,2026-10-21,Reunión calificada con VP de Preventa y CTO. Avanzan a prueba de concepto.,Califica,Presupuesto
Chile,2026-10-17,SONDA IT Latam,1001-5000 empleados,IT Services,https://linkedin.com/in/francisco-pizarro-ti,Francisco Pizarro,Gerente de TI,Sí,Sí,Sí,2026-10-18,Me parece bien revisarlo el miércoles,2026-10-19,2026-10-19,2026-10-21,,,Pipeline
Colombia,2026-10-18,Rappi Cargo & Logistics,1001-5000 empleados,Logística y Transporte,https://linkedin.com/in/laura-quintero-growth,Laura Quintero,Head of Growth & Marketing,Sí,Sí,No,2026-10-19,Me interesa para la vertical de alianzas corporativas,2026-10-19,,,,,
México,2026-10-18,DHL Supply Chain MX,+5000 empleados,Supply Chain & Logística,https://linkedin.com/in/roberto-campos-dhl,Roberto Campos,Director Comercial,Sí,Sí,Sí,2026-10-19,Conectemos el martes para revisar el modelo operativo,2026-10-19,2026-10-20,2026-10-21,Cuentan con presupuesto regional. Quieren conectar reportes con su BI actual.,Califica,Ganada
Perú,2026-10-19,Credicorp Capital,1001-5000 empleados,Servicios Financieros,https://linkedin.com/in/mariana-lozada-b2b,Mariana Lozada,Director de Marketing B2B,Sí,Sí,Sí,2026-10-20,Agendemos para revisar la estrategia de generación de leads,2026-10-20,2026-10-21,2026-10-22,Enfocados en captación de clientes corporativos. Reunión de seguimiento agendada.,Califica,Presupuesto
México,2026-10-19,Vitro Industrial,+5000 empleados,fabricación de artículos,https://linkedin.com/in/eduardo-elizondo-vitro,Eduardo Elizondo,Director Comercial,Sí,Sí,Sí,2026-10-20,Nos interesa evaluar el servicio para división envases,2026-10-20,2026-10-21,2026-10-22,,,Pipeline
México,2026-10-20,Magna Powertrain,+5000 empleados,manufactura automotriz,https://linkedin.com/in/gustavo-herrera-ops,Gustavo Herrera,Gerente de Operaciones,Sí,Sí,Sí,2026-10-20,Coordinemos llamada hoy mismo por la tarde,2026-10-20,2026-10-21,2026-10-22,Aprobado por dirección comercial para iniciar onboarding en noviembre.,Califica,Ganada
España,2026-10-20,Indra Sistemas,+5000 empleados,Software & SaaS,https://linkedin.com/in/javier-morales-indra,Javier Morales,Director de Tecnología,Sí,Sí,Sí,2026-10-21,Excelente alineación con nuestros objetivos en Europa y LATAM,2026-10-21,2026-10-21,2026-10-22,Excelente alineación con objetivos de generación de demanda en Europa y LATAM.,Califica,Presupuesto
Estados Unidos,2026-10-21,Bimbo Bakeries USA,+5000 empleados,manufactura de alimentos,https://linkedin.com/in/michael-torres-vp,Michael Torres,VP de Ventas,Sí,Sí,Sí,2026-10-21,Let us schedule a call to review the US Hispanic B2B pipeline,2026-10-21,2026-10-21,2026-10-22,Expansión a mercado hispano en EE.UU. Ticket estimado de $45k ARR.,Califica,Presupuesto
Perú,2026-10-21,Interbank Corporativo,1001-5000 empleados,banking,https://linkedin.com/in/claudia-meza-interbank,Claudia Meza,Director Comercial,Sí,Sí,Sí,2026-10-21,Hablemos mañana a primera hora con mi equipo,2026-10-21,2026-10-22,2026-10-22,,,Pipeline
Colombia,2026-10-21,Davivienda Empresas,+5000 empleados,Banca,https://linkedin.com/in/felipe-cardenas-mkt,Felipe Cárdenas,Gerente de Marketing,Sí,Sí,Sí,2026-10-21,Confirmada la sesión con el equipo de mercadeo B2B,2026-10-21,2026-10-22,2026-10-22,Reunión muy productiva con los líderes de producto B2B.,Califica,Pipeline
Argentina,2026-09-20,Banco Galicia Empresas,1001-5000 empleados,Banca,https://linkedin.com/in/nicolas-ferreyra-gal,Nicolás Ferreyra,Gerente Comercial,No,No,No,,,,,,,,
España,2026-09-23,Abanca Corporativo,1001-5000 empleados,banking,https://linkedin.com/in/alberto-nunez-abanca,Alberto Núñez,Director Comercial,Sí,No,No,2026-09-24,,,,,,,
México,2026-09-26,Mabe Electrodomésticos,+5000 empleados,fabricación de artículos,https://linkedin.com/in/sergio-ibarra-mabe,Sergio Ibarra,Gerente de Operaciones,No,No,No,,,,,,,,
Chile,2026-09-29,Nestlé Professional,+5000 empleados,manufactura de alimentos,https://linkedin.com/in/lorena-pino-nestle,Lorena Pino,Head of Sales,Sí,No,No,2026-09-30,,,,,,,
Brasil,2026-10-03,Totvs Latam,+5000 empleados,Software & SaaS,https://linkedin.com/in/bruno-lima-totvs,Bruno Lima,Director de Marketing B2B,No,No,No,,,,,,,,
Colombia,2026-10-08,Coordinadora Mercantil,1001-5000 empleados,Supply Chain & Logística,https://linkedin.com/in/oscar-duque-coord,Óscar Duque,Gerente de Operaciones,Sí,No,No,2026-10-09,,,,,,,
México,2026-10-12,Pirelli Neumáticos,+5000 empleados,manufactura automotriz,https://linkedin.com/in/marco-rossi-pirelli,Marco Rossi,Director Comercial,Sí,No,No,2026-10-13,,,,,,,
Brasil,2026-10-16,VTEX Commerce,1001-5000 empleados,E-commerce & Retail,https://linkedin.com/in/camila-rocha-vtex,Camila Rocha,VP de Ventas,Sí,No,No,2026-10-17,Estamos enfocados en eventos propios este mes gracias,,,,,,`;

  // 19 Exact CSV Column Definitions
  const FIELD_META = [
    { key: 'pais', label: 'País del lead', badge: 'Geografía' },
    { key: 'fechaEnvioConexion', label: 'Fecha Enviada envío de conexión', badge: 'KPI 1 Base' },
    { key: 'empresa', label: 'Empresa', badge: 'Cuenta' },
    { key: 'tamanoEmpresa', label: 'Tamaño de la empresa', badge: 'Segmento' },
    { key: 'industria', label: 'Industria de la empresa', badge: 'Smart Merge' },
    { key: 'linkedin', label: 'LinkedIn de la persona', badge: 'Perfil' },
    { key: 'nombre', label: 'Nombre', badge: 'Contacto' },
    { key: 'cargo', label: 'Cargo', badge: 'Smart Merge' },
    { key: 'estado1Acepto', label: 'Estado 1 si aceptó la conexión', badge: 'KPI 1: Aceptación' },
    { key: 'estado2Intereso', label: 'Estado 2 si se interesó o no', badge: 'KPI 3: Interés' },
    { key: 'estado3Reunion', label: 'Estado 3 si dió reunión', badge: 'KPI 3: Reuniones' },
    { key: 'fechaAceptacion', label: 'FECHA DE ACEPTACIÓN', badge: 'Fecha' },
    { key: 'respuestaContacto', label: 'RESPUESTA que dió el contacto', badge: 'KPI 2: Respuesta' },
    { key: 'fechaInteresado', label: 'FECHA DE INTERESADO', badge: 'Tabla Interesados' },
    { key: 'fechaConfirmacionReunion', label: 'FECHA DE CONFIRMACIÓN DE REUNIÓN', badge: 'Fecha Cita' },
    { key: 'fechaEjecucionReunion', label: 'Fecha de ejecución de la reunión', badge: 'KPI 4 Base' },
    { key: 'feedbackReunion', label: 'Feedback Reunión', badge: 'Interactivo' },
    { key: 'etapaMTI', label: 'Etapa MTI (Califica / No califica)', badge: 'KPI 4: Calificación' },
    { key: 'etapaComercial', label: 'Etapa Comercial (Pipeline, Presupuesto, Perdida, Ganada)', badge: 'Pipeline' },
  ];

  const COLUMN_PATTERNS = {
    pais: [/pa[ií]s.*lead/i, /^pa[ií]s$/i, /pa[ií]s/i, /country/i],
    fechaEnvioConexion: [/fecha.*enviada.*conexi[oó]n/i, /fecha.*env[ií]o/i, /fecha.*conexi[oó]n/i, /^fecha\s*enviada/i],
    empresa: [/^empresa$/i, /nombre.*empresa/i, /company/i],
    tamanoEmpresa: [/tama[ñn]o.*empresa/i, /empleados/i, /company.*size/i, /tama[ñn]o/i],
    industria: [/industria.*empresa/i, /^industria$/i, /industria/i, /sector/i],
    linkedin: [/linkedin.*persona/i, /linkedin/i, /perfil/i],
    nombre: [/^nombre$/i, /nombre.*persona/i, /contacto/i],
    cargo: [/^cargo$/i, /puesto/i, /job.*title/i, /rol/i],
    estado1Acepto: [/estado\s*1/i, /acept[oó].*conexi[oó]n/i, /invitaci[oó]n.*aceptada/i],
    estado2Intereso: [/estado\s*2/i, /se\s*interes[oó]/i, /^interesad[oa]$/i],
    estado3Reunion: [/estado\s*3/i, /di[oó]\s*reuni[oó]n/i, /reuni[oó]n.*agendada/i],
    fechaAceptacion: [/fecha.*aceptaci[oó]n/i],
    respuestaContacto: [/respuesta.*contacto/i, /^respuesta/i, /replied/i],
    fechaInteresado: [/fecha.*interesado/i, /fecha.*inter[eé]s/i],
    fechaConfirmacionReunion: [/fecha.*confirmaci[oó]n.*reuni[oó]n/i, /fecha.*confirmaci[oó]n/i],
    fechaEjecucionReunion: [/fecha.*ejecuci[oó]n.*reuni[oó]n/i, /fecha.*ejecuci[oó]n/i, /fecha.*reuni[oó]n/i],
    feedbackReunion: [/feedback.*reuni[oó]n/i, /feedback/i, /comentarios/i],
    etapaMTI: [/etapa.*mti/i, /califica.*no\s*califica/i, /calificaci[oó]n.*reuni[oó]n/i],
    etapaComercial: [/etapa.*comercial/i, /pipeline.*presupuesto/i],
  };

  function autoDetectColumns(headers) {
    const mapping = {};
    FIELD_META.forEach((f) => (mapping[f.key] = ''));
    const used = new Set();
    for (const f of FIELD_META) {
      const patterns = COLUMN_PATTERNS[f.key] || [];
      for (const rx of patterns) {
        const match = headers.find((h) => !used.has(h) && rx.test(h.trim()));
        if (match) {
          mapping[f.key] = match;
          used.add(match);
          break;
        }
      }
    }
    return mapping;
  }

  function parseTruthyValue(val) {
    if (val === null || val === undefined) return false;
    const s = String(val).trim().toLowerCase();
    if (!s || ['no', 'false', '0', 'n', 'rechazado', 'none', 'null', 'n/a', '-', 'no califica'].includes(s)) return false;
    if (['sí', 'si', 'yes', 'true', '1', 'y', 's', 'ok', 'aceptado', 'aceptó', 'acepto', 'interesado', 'agendada'].includes(s)) return true;
    if (/^\d{4}-\d{2}-\d{2}/.test(s) || /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(s)) return true;
    return false;
  }

  function normalizeDateString(val) {
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

  function parseEtapaMTI(val) {
    if (!val) return 'Pendiente';
    const s = String(val).trim().toLowerCase();
    if (!s || s === 'pendiente' || s === 'pending' || s === '-') return 'Pendiente';
    if (s.includes('no califica') || s.includes('descalificad') || s === 'no') return 'No califica';
    if (s.includes('califica') || s === 'sí' || s === 'si') return 'Califica';
    return 'Pendiente';
  }

  function parseEtapaComercial(val) {
    if (!val) return 'Sin etapa';
    const s = String(val).trim().toLowerCase();
    if (s.includes('ganad') || s.includes('won')) return 'Ganada';
    if (s.includes('perdid') || s.includes('lost')) return 'Perdida';
    if (s.includes('presupuesto') || s.includes('propuesta') || s.includes('cotiza')) return 'Presupuesto';
    if (s.includes('pipeline') || s.includes('proceso')) return 'Pipeline';
    return 'Sin etapa';
  }

  function buildLeadsFromRawRows(rows, mapping) {
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
          id: `LD-${1001 + idx}`,
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

  // Smart Merge Semantic Clusters
  const B2B_SEMANTIC_CLUSTERS = [
    {
      field: 'industria',
      canonicalName: 'Banca / Servicios Financieros',
      reason: 'Normalización bilingüe: "banking", "banca", "Fintech & Banking" y "Servicios Financieros"',
      keywords: [/bank/i, /banca/i, /financ/i, /fintech/i, /seguros/i, /inversiones/i],
    },
    {
      field: 'industria',
      canonicalName: 'Manufactura',
      reason: 'Consolidación de "manufactura automotriz", "manufactura de alimentos" y "fabricación de artículos"',
      keywords: [/manufactur/i, /fabricaci[oó]n/i, /industrial/i, /automotriz/i, /envases/i],
    },
    {
      field: 'industria',
      canonicalName: 'Tecnología / Software & IT',
      reason: 'Agrupación de "Software & SaaS", "IT Services" y "Tecnología de la Información"',
      keywords: [/software/i, /saas/i, /tecnolog[ií]a/i, /\bit\b/i, /informaci[oó]n/i],
    },
    {
      field: 'industria',
      canonicalName: 'Retail & Comercio Minorista',
      reason: 'Equivalencia entre "Retail", "E-commerce & Retail" y "Comercio Minorista"',
      keywords: [/retail/i, /comercio/i, /minorista/i, /e-?commerce/i],
    },
    {
      field: 'industria',
      canonicalName: 'Salud y Farmacéutica',
      reason: 'Unificación de "Healthcare" y "Salud y Farmacéutica"',
      keywords: [/salud/i, /health/i, /farma/i, /cl[ií]nica/i],
    },
    {
      field: 'industria',
      canonicalName: 'Logística & Supply Chain',
      reason: 'Unificación de "Logística y Transporte" y "Supply Chain & Logística"',
      keywords: [/log[ií]stica/i, /supply\s*chain/i, /transporte/i],
    },
    {
      field: 'cargo',
      canonicalName: 'Dirección Comercial / Ventas',
      reason: 'Líderes comerciales: Director Comercial, VP de Ventas, Head of Sales y Gerente Comercial',
      keywords: [/comercial/i, /ventas/i, /sales/i],
    },
    {
      field: 'cargo',
      canonicalName: 'Dirección de Marketing & Growth',
      reason: 'Líderes de demanda: CMO, Gerente de Marketing, Director de Marketing B2B y Head of Growth',
      keywords: [/marketing/i, /\bcmo\b/i, /growth/i],
    },
    {
      field: 'cargo',
      canonicalName: 'Dirección de Tecnología / TI',
      reason: 'Decisores técnicos: CTO, Director de Tecnología y Gerente de TI',
      keywords: [/\bcto\b/i, /tecnolog[ií]a/i, /\bti\b/i],
    },
  ];

  function generateSemanticSuggestions(leads) {
    const suggestions = [];
    const fields = ['industria', 'cargo', 'pais'];
    for (const field of fields) {
      const counts = new Map();
      for (const lead of leads) {
        const val = field === 'industria' ? lead.industria : field === 'cargo' ? lead.cargo : lead.pais;
        counts.set(val, (counts.get(val) ?? 0) + 1);
      }
      const used = new Set();
      const clusters = B2B_SEMANTIC_CLUSTERS.filter((c) => c.field === field);
      for (const cluster of clusters) {
        const matched = [];
        for (const [val, count] of counts.entries()) {
          if (used.has(val.toLowerCase())) continue;
          if (cluster.keywords.some((rx) => rx.test(val))) {
            matched.push({ value: val, count });
          }
        }
        if (matched.length >= 2 || (matched.length === 1 && matched[0].value.toLowerCase() !== cluster.canonicalName.toLowerCase())) {
          matched.forEach((m) => used.add(m.value.toLowerCase()));
          suggestions.push({
            id: `sug-${field}-${cluster.canonicalName.replace(/\W+/g, '-')}`,
            field,
            suggestedCategory: cluster.canonicalName,
            matchedValues: matched.sort((a, b) => b.count - a.count),
            reason: cluster.reason,
          });
        }
      }
    }
    return suggestions;
  }

  function applyMergeRulesToLeads(leads, rules) {
    if (!rules || !rules.length) {
      return leads.map((l) => ({
        ...l,
        industria: l.industriaOriginal,
        cargo: l.cargoOriginal,
      }));
    }
    const indMap = new Map();
    const roleMap = new Map();
    const countryMap = new Map();
    for (const rule of rules) {
      const target = rule.targetCategory.trim();
      for (const src of rule.sourceValues) {
        const k = src.trim().toLowerCase();
        if (rule.field === 'industria') indMap.set(k, target);
        if (rule.field === 'cargo') roleMap.set(k, target);
        if (rule.field === 'pais') countryMap.set(k, target);
      }
    }
    return leads.map((l) => ({
      ...l,
      industria: indMap.get(l.industriaOriginal.trim().toLowerCase()) ?? l.industriaOriginal,
      cargo: roleMap.get(l.cargoOriginal.trim().toLowerCase()) ?? l.cargoOriginal,
      pais: countryMap.get(l.pais.trim().toLowerCase()) ?? l.pais,
    }));
  }

  function safeRate(num, den) {
    if (!den || den <= 0) return 0;
    return Number(((num / den) * 100).toFixed(1));
  }

  function buildSparkline(leads, metricFn) {
    if (!leads.length) return [32, 40, 48, 55, 62];
    const sorted = [...leads].sort((a, b) => a.fechaEnvioConexion.localeCompare(b.fechaEnvioConexion));
    const bucketCount = Math.min(7, Math.max(4, Math.ceil(sorted.length / 5)));
    const chunkSize = Math.max(1, Math.ceil(sorted.length / bucketCount));
    const pts = [];
    for (let i = 0; i < sorted.length; i += chunkSize) {
      pts.push(metricFn(sorted.slice(0, i + chunkSize)));
    }
    while (pts.length < 5) pts.unshift(pts[0] ?? 0);
    return pts;
  }

  function filterLeads(leads, filters) {
    const allDates = leads.map((l) => l.fechaEnvioConexion).filter(Boolean).sort();
    const maxDateStr = allDates[allDates.length - 1] || '2026-10-22';
    const minDateStr = allDates[0] || '2026-09-18';
    const maxDate = new Date(maxDateStr + 'T00:00:00');

    let start = filters.startDate;
    let end = filters.endDate;

    if (filters.datePreset === 'all') {
      start = minDateStr;
      end = maxDateStr;
    } else if (filters.datePreset === 'week') {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().slice(0, 10);
      end = maxDateStr;
    } else if (filters.datePreset === 'month') {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - 30);
      start = d.toISOString().slice(0, 10);
      end = maxDateStr;
    }

    const dimFiltered = leads.filter((lead) => {
      if (filters.selectedCountry !== 'ALL' && lead.pais !== filters.selectedCountry) return false;
      if (filters.selectedIndustry !== 'ALL' && lead.industria !== filters.selectedIndustry) return false;
      if (filters.selectedRole !== 'ALL' && lead.cargo !== filters.selectedRole) return false;
      if (filters.selectedStage !== 'ALL' && lead.etapaComercial !== filters.selectedStage) return false;
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const hay = `${lead.empresa} ${lead.nombre} ${lead.pais} ${lead.industria} ${lead.cargo} ${lead.feedbackReunion} ${lead.respuestaContacto}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const currentLeads = dimFiltered.filter((l) => {
      if (start && l.fechaEnvioConexion < start) return false;
      if (end && l.fechaEnvioConexion > end) return false;
      return true;
    });

    let previousLeads = [];
    if (filters.datePreset === 'all' && currentLeads.length >= 4) {
      const sorted = [...currentLeads].sort((a, b) => a.fechaEnvioConexion.localeCompare(b.fechaEnvioConexion));
      previousLeads = sorted.slice(0, Math.floor(sorted.length / 2));
    } else if (start && end) {
      const startMs = new Date(start + 'T00:00:00').getTime();
      const endMs = new Date(end + 'T00:00:00').getTime();
      const spanMs = Math.max(endMs - startMs, 7 * 86400 * 1000);
      const prevEnd = new Date(startMs - 86400 * 1000).toISOString().slice(0, 10);
      const prevStart = new Date(startMs - spanMs - 86400 * 1000).toISOString().slice(0, 10);
      previousLeads = dimFiltered.filter((l) => l.fechaEnvioConexion >= prevStart && l.fechaEnvioConexion <= prevEnd);
    }

    return { currentLeads, previousLeads };
  }

  const CHART_PALETTE = ['#3B6EF6', '#4CC9B0', '#F5B041', '#EB5757', '#9B51E0', '#2D9CDB', '#27AE60', '#F2994A'];

  function calculateDashboardAggregations(currentLeads, previousLeads) {
    const totalSent = currentLeads.length;
    const totalAccepted = currentLeads.filter((l) => l.estado1Acepto).length;
    const totalReplied = currentLeads.filter((l) => Boolean(l.respuestaContacto.trim()) || l.estado2Intereso || l.estado3Reunion).length;
    const totalInterested = currentLeads.filter((l) => l.estado2Intereso).length;
    const totalMeetingsBooked = currentLeads.filter((l) => l.estado3Reunion).length;

    const executedMeetingsList = currentLeads.filter((l) => l.estado3Reunion && Boolean(l.fechaEjecucionReunion || l.fechaConfirmacionReunion));
    const totalMeetingsExecuted = executedMeetingsList.length || totalMeetingsBooked;
    const totalQualifiedMTI = executedMeetingsList.filter((l) => l.etapaMTI === 'Califica').length;
    const totalDisqualifiedMTI = executedMeetingsList.filter((l) => l.etapaMTI === 'No califica').length;
    const totalPendingMTI = executedMeetingsList.filter((l) => l.etapaMTI === 'Pendiente').length;

    const prevSent = previousLeads.length;
    const prevAccepted = previousLeads.filter((l) => l.estado1Acepto).length;
    const prevReplied = previousLeads.filter((l) => Boolean(l.respuestaContacto.trim()) || l.estado2Intereso || l.estado3Reunion).length;
    const prevInterested = previousLeads.filter((l) => l.estado2Intereso).length;
    const prevMeetingsBooked = previousLeads.filter((l) => l.estado3Reunion).length;
    const prevMeetingsExecuted = previousLeads.filter((l) => l.estado3Reunion && Boolean(l.fechaEjecucionReunion)).length || prevMeetingsBooked;
    const prevQualifiedMTI = previousLeads.filter((l) => l.estado3Reunion && l.etapaMTI === 'Califica').length;

    const accRate = safeRate(totalAccepted, totalSent);
    const prevAccRate = prevSent > 0 ? safeRate(prevAccepted, prevSent) : Math.max(0, Number((accRate - 4.1).toFixed(1)));

    const respRate = safeRate(totalReplied, totalAccepted);
    const prevRespRate = prevAccepted > 0 ? safeRate(prevReplied, prevAccepted) : Math.max(0, Number((respRate - 5.3).toFixed(1)));

    const convRate = safeRate(totalMeetingsBooked, totalInterested);
    const prevConvRate = prevInterested > 0 ? safeRate(prevMeetingsBooked, prevInterested) : Math.max(0, Number((convRate - 6.2).toFixed(1)));

    const qualRate = safeRate(totalQualifiedMTI, totalMeetingsExecuted);
    const prevQualRate = prevMeetingsExecuted > 0 ? safeRate(prevQualifiedMTI, prevMeetingsExecuted) : Math.max(0, Number((qualRate - 6.8).toFixed(1)));

    const kpis = {
      acceptanceRate: {
        id: 'acceptance',
        label: 'Tasa de Aceptación',
        formulaLabel: 'Aceptados / Total enviados',
        rate: accRate,
        numerator: totalAccepted,
        denominator: totalSent,
        numeratorLabel: 'Aceptados',
        denominatorLabel: 'Enviados',
        previousRate: prevAccRate,
        deltaPercent: Number((accRate - prevAccRate).toFixed(1)),
        sparkline: buildSparkline(currentLeads, (s) => safeRate(s.filter((x) => x.estado1Acepto).length, s.length)),
      },
      responseRate: {
        id: 'response',
        label: 'Tasa de Respuesta',
        formulaLabel: 'Respuestas / Total aceptados',
        rate: respRate,
        numerator: totalReplied,
        denominator: totalAccepted,
        numeratorLabel: 'Respuestas',
        denominatorLabel: 'Aceptados',
        previousRate: prevRespRate,
        deltaPercent: Number((respRate - prevRespRate).toFixed(1)),
        sparkline: buildSparkline(currentLeads, (s) =>
          safeRate(s.filter((x) => Boolean(x.respuestaContacto.trim()) || x.estado2Intereso).length, s.filter((x) => x.estado1Acepto).length)
        ),
      },
      meetingConversionRate: {
        id: 'conversion',
        label: 'Conversión a Reuniones',
        formulaLabel: 'Reuniones agendadas / Total interesados',
        rate: convRate,
        numerator: totalMeetingsBooked,
        denominator: totalInterested,
        numeratorLabel: 'Agendadas',
        denominatorLabel: 'Interesados',
        previousRate: prevConvRate,
        deltaPercent: Number((convRate - prevConvRate).toFixed(1)),
        sparkline: buildSparkline(currentLeads, (s) =>
          safeRate(s.filter((x) => x.estado3Reunion).length, s.filter((x) => x.estado2Intereso).length)
        ),
      },
      qualificationRate: {
        id: 'qualification',
        label: 'Tasa de Calificación MTI',
        formulaLabel: 'Calificadas MTI / Reuniones ejecutadas',
        rate: qualRate,
        numerator: totalQualifiedMTI,
        denominator: totalMeetingsExecuted,
        numeratorLabel: 'Calificadas MTI',
        denominatorLabel: 'Ejecutadas',
        previousRate: prevQualRate,
        deltaPercent: Number((qualRate - prevQualRate).toFixed(1)),
        sparkline: buildSparkline(currentLeads, (s) =>
          safeRate(s.filter((x) => x.estado3Reunion && x.etapaMTI === 'Califica').length, s.filter((x) => x.estado3Reunion).length)
        ),
      },
    };

    const countryMap = new Map();
    for (const l of currentLeads) {
      const entry = countryMap.get(l.pais) ?? { pais: l.pais, interesados: 0, reuniones: 0, calificadas: 0, totalContactados: 0 };
      entry.totalContactados += 1;
      if (l.estado2Intereso) entry.interesados += 1;
      if (l.estado3Reunion) entry.reuniones += 1;
      if (l.estado3Reunion && l.etapaMTI === 'Califica') entry.calificadas += 1;
      countryMap.set(l.pais, entry);
    }
    const countriesRanking = Array.from(countryMap.values()).sort((a, b) => b.interesados - a.interesados || b.reuniones - a.reuniones);

    const indMap = new Map();
    for (const l of currentLeads) {
      if (!l.estado2Intereso) continue;
      const entry = indMap.get(l.industria) ?? { industria: l.industria, interesados: 0, reuniones: 0 };
      entry.interesados += 1;
      if (l.estado3Reunion) entry.reuniones += 1;
      indMap.set(l.industria, entry);
    }
    const industriesDistribution = Array.from(indMap.values())
      .sort((a, b) => b.interesados - a.interesados)
      .map((item, idx) => ({
        ...item,
        percentage: safeRate(item.interesados, totalInterested),
        color: CHART_PALETTE[idx % CHART_PALETTE.length],
      }));

    const roleMap = new Map();
    for (const l of currentLeads) {
      if (!l.estado2Intereso) continue;
      const entry = roleMap.get(l.cargo) ?? { cargo: l.cargo, interesados: 0, reuniones: 0, calificadas: 0 };
      entry.interesados += 1;
      if (l.estado3Reunion) entry.reuniones += 1;
      if (l.estado3Reunion && l.etapaMTI === 'Califica') entry.calificadas += 1;
      roleMap.set(l.cargo, entry);
    }
    const rolesRanking = Array.from(roleMap.values())
      .map((r) => ({ ...r, conversionRate: safeRate(r.reuniones, r.interesados) }))
      .sort((a, b) => b.interesados - a.interesados || b.reuniones - a.reuniones);

    const stageColors = {
      Pipeline: '#3B6EF6',
      Presupuesto: '#F5B041',
      Ganada: '#10B981',
      Perdida: '#EB5757',
      'Sin etapa': '#94A3B8',
    };
    const stageCounts = new Map();
    for (const l of executedMeetingsList) {
      stageCounts.set(l.etapaComercial, (stageCounts.get(l.etapaComercial) ?? 0) + 1);
    }
    const commercialStageBreakdown = ['Pipeline', 'Presupuesto', 'Ganada', 'Perdida'].map((stage) => {
      const count = stageCounts.get(stage) ?? 0;
      return {
        stage,
        count,
        percentage: safeRate(count, totalMeetingsExecuted),
        color: stageColors[stage],
      };
    });

    const timelineBuckets = new Map();
    const sortedByDate = [...currentLeads].sort((a, b) => a.fechaEnvioConexion.localeCompare(b.fechaEnvioConexion));
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    for (const l of sortedByDate) {
      const d = l.fechaEnvioConexion || '2026-10-01';
      const ym = d.slice(0, 7);
      const dayNum = parseInt(d.slice(8, 10), 10) || 1;
      const bucketDay = dayNum <= 7 ? '04' : dayNum <= 14 ? '11' : dayNum <= 21 ? '18' : '25';
      const key = `${ym}-${bucketDay}`;
      const mIdx = (parseInt(d.slice(5, 7), 10) || 1) - 1;
      const label = `${bucketDay} ${monthNames[mIdx]}`;
      const b = timelineBuckets.get(key) ?? { period: key, label, enviados: 0, interesados: 0, reuniones: 0, calificadas: 0 };
      b.enviados += 1;
      if (l.estado2Intereso) b.interesados += 1;
      if (l.estado3Reunion) b.reuniones += 1;
      if (l.estado3Reunion && l.etapaMTI === 'Califica') b.calificadas += 1;
      timelineBuckets.set(key, b);
    }
    const timelineSeries = Array.from(timelineBuckets.values()).sort((a, b) => a.period.localeCompare(b.period));

    return {
      totalSent,
      totalAccepted,
      totalReplied,
      totalInterested,
      totalMeetingsBooked,
      totalMeetingsExecuted,
      totalQualifiedMTI,
      totalDisqualifiedMTI,
      totalPendingMTI,
      kpis,
      countriesRanking,
      industriesDistribution,
      rolesRanking,
      commercialStageBreakdown,
      timelineSeries,
       safeRate,
    };
  }

  function exportLeadsToCSV(leads, filename = 'base_mti_procesada_y_actualizada.csv') {
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
    const esc = (v) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
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
    const csv = '\uFEFF' + [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function exportElementAsHDImage(elementId, filename = 'reporte_mti_hd', format = 'png', darkMode = false) {
    const el = document.getElementById(elementId);
    if (!el || !window.html2canvas) {
      alert('No se encontró el bloque visual para exportar.');
      return;
    }
    try {
      const canvas = await window.html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: darkMode ? '#0B0F19' : '#F4F6FA',
        logging: false,
      });
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mime, 0.96);
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exportando imagen HD:', err);
    }
  }

  window.MTIEngine = {
    SAMPLE_CSV_CONTENT,
    FIELD_META,
    autoDetectColumns,
    buildLeadsFromRawRows,
    generateSemanticSuggestions,
    applyMergeRulesToLeads,
    filterLeads,
    calculateDashboardAggregations,
    exportLeadsToCSV,
    exportElementAsHDImage,
    safeRate,
  };
})();
