import { XMLParser } from 'fast-xml-parser';
import { Mes, meses, TipoFestividad } from '../shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from '../shared/models/output/find-festivos-provincia.response';
import { PROVINCIAS_ESPANA, CCAA_HEADER_MAP } from '../shared/models/provincias';

export interface BoeParsedData {
  titulo: string;
  year: number;
  provincesHolidays: Record<string, FindFestivosProvinciaResponse>;
}

export interface BoeAbbrNode {
  '#text'?: string | number;
  '@_title'?: string;
  [key: string]: unknown;
}

export interface BoeCellNode {
  '#text'?: string | number;
  '@_headers'?: string;
  '@_id'?: string;
  '@_axis'?: string;
  p?: BoeCellNode | string | number;
  abbr?: BoeAbbrNode;
  strong?: BoeCellNode | string | number;
  em?: BoeCellNode | string | number;
  b?: BoeCellNode | string | number;
  span?: BoeCellNode | string | number;
  [key: string]: unknown;
}

export interface BoeRowNode {
  th?: BoeCellNode | BoeCellNode[];
  td?: BoeCellNode | BoeCellNode[];
  [key: string]: unknown;
}

function extractText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    if (obj['#text'] !== undefined && obj['#text'] !== null) return String(obj['#text']);
    if (obj['p'] !== undefined) return extractText(obj['p']);
    if (obj['strong'] !== undefined) return extractText(obj['strong']);
    if (obj['em'] !== undefined) return extractText(obj['em']);
    if (obj['b'] !== undefined) return extractText(obj['b']);
    if (obj['span'] !== undefined) return extractText(obj['span']);
  }
  return '';
}

function findAbbr(cell: unknown): BoeAbbrNode | null {
  if (!cell || typeof cell !== 'object') return null;
  const obj = cell as Record<string, unknown>;
  if (obj['abbr'] && typeof obj['abbr'] === 'object') return obj['abbr'] as BoeAbbrNode;
  if (obj['p'] && typeof obj['p'] === 'object') {
    const pObj = obj['p'] as Record<string, unknown>;
    if (pObj['abbr'] && typeof pObj['abbr'] === 'object') return pObj['abbr'] as BoeAbbrNode;
  }
  return null;
}

export function parseBoeXml(xmlContent: string, fallbackYear?: number): BoeParsedData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    trimValues: true,
  });

  const parsed = parser.parse(xmlContent);
  const documento = parsed?.documento;
  if (!documento) {
    throw new Error('Invalid BOE XML: missing <documento> root');
  }

  const titulo: string = documento.metadatos?.titulo || '';
  const yearMatch = titulo.match(/año\s+(\d{4})/i) || documento.metadatos?.fecha_disposicion?.match(/^(\d{4})/);
  const detectedYear = yearMatch ? Number.parseInt(yearMatch[1], 10) : (fallbackYear || new Date().getFullYear());

  const table = documento.texto?.table;
  if (!table) {
    throw new Error(`Invalid BOE XML: holiday table structure not found in document "${titulo}"`);
  }

  // 1. Collect all rows from table.tr, table.tbody.tr, or table.thead.tr
  const allRows: BoeRowNode[] = [];
  if (Array.isArray(table.tr)) {
    allRows.push(...table.tr);
  } else if (table.tr) {
    allRows.push(table.tr);
  }

  if (table.thead) {
    const theadRows = Array.isArray(table.thead.tr) ? table.thead.tr : [table.thead.tr];
    allRows.push(...theadRows);
  }

  if (table.tbody) {
    const tbodyRows = Array.isArray(table.tbody.tr) ? table.tbody.tr : [table.tbody.tr];
    allRows.push(...tbodyRows);
  }

  // 2. Identify column index to CCAA fallback mapping
  let colIndexToCcaa: string[] = [];
  for (const row of allRows) {
    const ths: BoeCellNode[] = Array.isArray(row.th) ? row.th : (row.th ? [row.th] : []);
    if (ths.length >= 10) {
      colIndexToCcaa = ths.map((th: BoeCellNode) => {
        const rawId = (typeof th['@_id'] === 'string' ? th['@_id'] : '') || '';
        return CCAA_HEADER_MAP[rawId] || rawId.toLowerCase();
      });
      break;
    }
  }

  // 3. Initialize empty month maps for all CCAA
  const ccaaHolidays: Record<string, Record<Mes, DiaFestivo[]>> = {};
  for (const ccaa of Object.values(CCAA_HEADER_MAP)) {
    ccaaHolidays[ccaa] = createEmptyMonthsMap();
  }

  // 4. Process all rows
  let currentMonth: Mes | null = null;

  for (const row of allRows) {
    const cells: BoeCellNode[] = Array.isArray(row.td) ? row.td : (row.td ? [row.td] : []);
    if (cells.length === 0) continue;

    const firstCell = cells[0];
    const textContent = extractText(firstCell).trim();
    const lowerText = textContent.toLowerCase();

    // Month row check
    const matchedMonth = meses.find(m => lowerText.includes(m));
    if (matchedMonth && !/^\d+/.test(textContent)) {
      currentMonth = matchedMonth;
      continue;
    }

    // Holiday date row check
    if (/^\d+/.test(textContent)) {
      if (!currentMonth) continue;

      const dayMatch = textContent.match(/^(\d+)/);
      if (!dayMatch) continue;

      const dia = Number.parseInt(dayMatch[1], 10);
      const nameFestividad = textContent.replace(/^\d+\s*/, '').replace(/\.$/, '').trim();

      // Check each CCAA cell using two passes to prevent anomalies from malformed BOE rows
      const rowAssignments: Array<{ cellIndex: number; ccaaId: string; abbr: BoeAbbrNode }> = [];
      const assignedCcaas = new Set<string>();

      // Pass 1: explicit header mapping
      for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        const abbr = findAbbr(cell);
        if (!abbr) continue;

        const pNode = cell.p && typeof cell.p === 'object' ? (cell.p as Record<string, unknown>) : null;
        const headersAttr = (typeof cell['@_headers'] === 'string' ? cell['@_headers'] : (pNode && typeof pNode['@_headers'] === 'string' ? pNode['@_headers'] : '')) || '';
        if (headersAttr) {
          const parts = headersAttr.split(/\s+/);
          const headerPart = parts.find((p: string) => CCAA_HEADER_MAP[p]);
          if (headerPart) {
            const ccaaId = CCAA_HEADER_MAP[headerPart];
            if (!assignedCcaas.has(ccaaId)) {
              rowAssignments.push({ cellIndex: i, ccaaId, abbr });
              assignedCcaas.add(ccaaId);
            }
          }
        }
      }

      // Pass 2: unmapped cells with abbreviations get assigned to remaining unassigned CCAAs
      const unassignedCcaas = colIndexToCcaa.filter(c => !assignedCcaas.has(c));
      let unassignedIdx = 0;
      for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        const abbr = findAbbr(cell);
        if (!abbr) continue;

        const pNode = cell.p && typeof cell.p === 'object' ? (cell.p as Record<string, unknown>) : null;
        const headersAttr = (typeof cell['@_headers'] === 'string' ? cell['@_headers'] : (pNode && typeof pNode['@_headers'] === 'string' ? pNode['@_headers'] : '')) || '';
        const alreadyAssigned = rowAssignments.some(r => r.cellIndex === i);
        if (!alreadyAssigned && !headersAttr && unassignedIdx < unassignedCcaas.length) {
          const ccaaId = unassignedCcaas[unassignedIdx++];
          rowAssignments.push({ cellIndex: i, ccaaId, abbr });
          assignedCcaas.add(ccaaId);
        }
      }

      // Apply assignments to holiday map
      for (const { ccaaId, abbr } of rowAssignments) {
        if (!ccaaId || !ccaaHolidays[ccaaId]) continue;

        const abbrTitle = typeof abbr['@_title'] === 'string' ? abbr['@_title'] : '';
        const isAutonomico = abbrTitle.toLowerCase().includes('comunidad autónoma');
        const festividad: TipoFestividad = isAutonomico ? 'autonomico' : 'nacional';

        const monthMap = ccaaHolidays[ccaaId][currentMonth];
        if (monthMap && !monthMap.some(h => h.dia === dia)) {
          monthMap.push({
            dia,
            nameFestividad,
            festividad,
          });
        }
      }
    }
  }

  // 5. Map CCAA holidays to each official Province
  const provincesHolidays: Record<string, FindFestivosProvinciaResponse> = {};
  for (const prov of PROVINCIAS_ESPANA) {
    const ccaaHols = ccaaHolidays[prov.comunidadId];
    if (ccaaHols) {
      provincesHolidays[prov.id] = JSON.parse(JSON.stringify(ccaaHols));
    } else {
      provincesHolidays[prov.id] = createEmptyMonthsMap();
    }

    // Canary Islands specific: Statutory insular autonomic feast published in BOE footnotes
    if (prov.id === 'las-palmas') {
      const targetProv = provincesHolidays[prov.id];
      if (targetProv) {
        let sept = targetProv.septiembre;
        if (!sept) {
          sept = [];
          targetProv.septiembre = sept;
        }
        if (!sept.some(h => h.dia === 8)) {
          sept.push({ dia: 8, nameFestividad: 'Nuestra Señora del Pino', festividad: 'autonomico' });
          sept.sort((a, b) => a.dia - b.dia);
        }
      }
    } else if (prov.id === 'santa-cruz-de-tenerife') {
      const targetProv = provincesHolidays[prov.id];
      if (targetProv) {
        let feb = targetProv.febrero;
        if (!feb) {
          feb = [];
          targetProv.febrero = feb;
        }
        if (!feb.some(h => h.dia === 2)) {
          feb.push({ dia: 2, nameFestividad: 'Virgen de Candelaria', festividad: 'autonomico' });
          feb.sort((a, b) => a.dia - b.dia);
        }
      }
    }
  }

  return {
    titulo,
    year: detectedYear,
    provincesHolidays,
  };
}

function createEmptyMonthsMap(): Record<Mes, DiaFestivo[]> {
  const map = {} as Record<Mes, DiaFestivo[]>;
  for (const m of meses) {
    map[m] = [];
  }
  return map;
}
