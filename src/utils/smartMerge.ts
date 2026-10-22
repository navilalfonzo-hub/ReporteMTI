import { LeadRecord, MergeableField, MergeRule, SemanticSuggestion } from '../types/dashboard';

interface SemanticDictionaryCluster {
  field: MergeableField;
  canonicalName: string;
  reason: string;
  keywords: RegExp[];
}

const B2B_SEMANTIC_CLUSTERS: SemanticDictionaryCluster[] = [
  {
    field: 'industria',
    canonicalName: 'Banca / Servicios Financieros',
    reason: 'Variaciones semánticas de Banca, Banking, Fintech y Servicios Financieros',
    keywords: [/bank/i, /banca/i, /financ/i, /fintech/i, /seguros/i, /inversiones/i, /cr[eé]dito/i],
  },
  {
    field: 'industria',
    canonicalName: 'Manufactura',
    reason: 'Consolidación de Manufactura Automotriz, Alimentos y Fabricación de Artículos',
    keywords: [/manufactur/i, /fabricaci[oó]n/i, /industrial/i, /automotriz/i, /planta/i, /envases/i, /ensamble/i],
  },
  {
    field: 'industria',
    canonicalName: 'Tecnología / Software & IT',
    reason: 'Unificación de Software, SaaS, IT Services y Tecnología de la Información',
    keywords: [/software/i, /saas/i, /tecnolog[ií]a/i, /\bit\b/i, /informaci[oó]n/i, /cloud/i, /digital/i, /sistemas/i],
  },
  {
    field: 'industria',
    canonicalName: 'Retail & Comercio Minorista',
    reason: 'Agrupación bilingüe de Retail, E-commerce y Comercio Minorista',
    keywords: [/retail/i, /comercio/i, /minorista/i, /e-?commerce/i, /tiendas/i, /consumo/i],
  },
  {
    field: 'industria',
    canonicalName: 'Salud y Farmacéutica',
    reason: 'Equivalencia entre Healthcare, Clínicas, Salud y Farmacéutica',
    keywords: [/salud/i, /health/i, /farma/i, /pharma/i, /cl[ií]nica/i, /m[eé]dic/i, /hospital/i],
  },
  {
    field: 'industria',
    canonicalName: 'Logística & Supply Chain',
    reason: 'Unificación de Logística, Transporte y Cadena de Suministro',
    keywords: [/log[ií]stica/i, /supply\s*chain/i, /transporte/i, /cargo/i, /distribuci[oó]n/i],
  },
  // Cargos / Job Titles
  {
    field: 'cargo',
    canonicalName: 'Dirección Comercial / Ventas',
    reason: 'Líderes de ingresos: Director Comercial, VP de Ventas, Head of Sales y Gerente Comercial',
    keywords: [/comercial/i, /ventas/i, /sales/i, /revenue/i, /cro/i],
  },
  {
    field: 'cargo',
    canonicalName: 'Dirección de Marketing & Growth',
    reason: 'Líderes de demanda: CMO, Gerente de Marketing, Director de Marketing B2B y Head of Growth',
    keywords: [/marketing/i, /\bcmo\b/i, /growth/i, /demanda/i, /brand/i],
  },
  {
    field: 'cargo',
    canonicalName: 'Dirección de Tecnología / TI',
    reason: 'Líderes técnicos: CTO, Director de Tecnología, Gerente de TI e IT Manager',
    keywords: [/\bcto\b/i, /tecnolog[ií]a/i, /\bti\b/i, /\bit\b/i, /sistemas/i, /engineering/i],
  },
  {
    field: 'cargo',
    canonicalName: ' Operaciones y Planta',
    reason: 'Líderes operativos: Gerente de Operaciones, Director de Planta y COO',
    keywords: [/operaciones/i, /planta/i, /\bcoo\b/i, /operations/i, /producci[oó]n/i],
  },
  {
    field: 'cargo',
    canonicalName: 'Dirección General / CEO',
    reason: 'Ejecutivos C-Level: CEO, Director General y Founder',
    keywords: [/\bceo\b/i, /director\s*general/i, /founder/i, /presidente/i, /propietario/i],
  },
];

function normalizeToken(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshteinDistance(a: string, b: string): number {
  const s1 = normalizeToken(a);
  const s2 = normalizeToken(b);
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function generateSemanticSuggestions(
  leads: LeadRecord[],
  existingRules: MergeRule[]
): SemanticSuggestion[] {
  const suggestions: SemanticSuggestion[] = [];

  const fields: MergeableField[] = ['industria', 'cargo', 'pais'];

  for (const field of fields) {
    // Count current unmerged values
    const counts = new Map<string, number>();
    for (const lead of leads) {
      const val = field === 'industria' ? lead.industria : field === 'cargo' ? lead.cargo : lead.pais;
      counts.set(val, (counts.get(val) ?? 0) + 1);
    }

    const alreadyMergedValues = new Set(
      existingRules.filter((r) => r.field === field).flatMap((r) => r.sourceValues.map((v) => v.toLowerCase()))
    );

    const usedInSuggestion = new Set<string>();

    // 1. Dictionary-based semantic clusters
    const clustersForField = B2B_SEMANTIC_CLUSTERS.filter((c) => c.field === field);
    for (const cluster of clustersForField) {
      const matched: { value: string; count: number }[] = [];

      for (const [val, count] of counts.entries()) {
        if (usedInSuggestion.has(val.toLowerCase())) continue;
        if (alreadyMergedValues.has(val.toLowerCase()) && val === cluster.canonicalName.trim()) continue;
        if (cluster.keywords.some((rx) => rx.test(val))) {
          matched.push({ value: val, count });
        }
      }

      // Suggest if there are >= 2 distinct variations OR 1 variation that differs in casing/naming from canonical
      if (
        matched.length >= 2 ||
        (matched.length === 1 && matched[0].value.toLowerCase() !== cluster.canonicalName.trim().toLowerCase())
      ) {
        matched.forEach((m) => usedInSuggestion.add(m.value.toLowerCase()));
        suggestions.push({
          id: `sug-${field}-${cluster.canonicalName.replace(/\W+/g, '-')}`,
          field,
          suggestedCategory: cluster.canonicalName.trim(),
          matchedValues: matched.sort((a, b) => b.count - a.count),
          reason: cluster.reason,
        });
      }
    }

    // 2. Fuzzy Levenshtein / Stem similarity for any remaining values
    const remainingEntries = Array.from(counts.entries()).filter(
      ([val]) => !usedInSuggestion.has(val.toLowerCase())
    );

    for (let i = 0; i < remainingEntries.length; i++) {
      const [valA, countA] = remainingEntries[i];
      if (usedInSuggestion.has(valA.toLowerCase())) continue;

      const group: { value: string; count: number }[] = [{ value: valA, count: countA }];

      for (let j = i + 1; j < remainingEntries.length; j++) {
        const [valB, countB] = remainingEntries[j];
        if (usedInSuggestion.has(valB.toLowerCase())) continue;

        const normA = normalizeToken(valA);
        const normB = normalizeToken(valB);
        const dist = levenshteinDistance(normA, normB);
        const maxLen = Math.max(normA.length, normB.length, 1);
        const similarity = 1 - dist / maxLen;

        const sharedPrefix = normA.length >= 5 && normB.length >= 5 && normA.slice(0, 6) === normB.slice(0, 6);

        if (similarity >= 0.72 || sharedPrefix) {
          group.push({ value: valB, count: countB });
          usedInSuggestion.add(valB.toLowerCase());
        }
      }

      if (group.length >= 2) {
        usedInSuggestion.add(valA.toLowerCase());
        const sortedGroup = group.sort((a, b) => b.count - a.count);
        const bestTitle = sortedGroup[0].value.charAt(0).toUpperCase() + sortedGroup[0].value.slice(1);
        suggestions.push({
          id: `fuzzy-${field}-${normalizeToken(bestTitle).replace(/\s+/g, '-')}`,
          field,
          suggestedCategory: bestTitle,
          matchedValues: sortedGroup,
          reason: 'Similitud léxica detectada automáticamente (Fuzzy Matching)',
        });
      }
    }
  }

  return suggestions;
}

export function applyMergeRulesToLeads(leads: LeadRecord[], rules: MergeRule[]): LeadRecord[] {
  if (!rules.length) {
    return leads.map((lead) => ({
      ...lead,
      industria: lead.industriaOriginal,
      cargo: lead.cargoOriginal,
    }));
  }

  const industryMap = new Map<string, string>();
  const roleMap = new Map<string, string>();
  const countryMap = new Map<string, string>();

  for (const rule of rules) {
    const target = rule.targetCategory.trim();
    for (const src of rule.sourceValues) {
      const key = src.trim().toLowerCase();
      if (rule.field === 'industria') industryMap.set(key, target);
      if (rule.field === 'cargo') roleMap.set(key, target);
      if (rule.field === 'pais') countryMap.set(key, target);
    }
  }

  return leads.map((lead) => {
    const indKey = lead.industriaOriginal.trim().toLowerCase();
    const roleKey = lead.cargoOriginal.trim().toLowerCase();
    const countryKey = lead.pais.trim().toLowerCase();

    return {
      ...lead,
      industria: industryMap.get(indKey) ?? lead.industriaOriginal,
      cargo: roleMap.get(roleKey) ?? lead.cargoOriginal,
      pais: countryMap.get(countryKey) ?? lead.pais,
    };
  });
}
