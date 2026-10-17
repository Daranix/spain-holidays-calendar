import { XMLParser } from 'fast-xml-parser';
import { Mes, meses, TipoFestividad } from '../shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from '../shared/models/output/find-festivos-provincia.response';
import { PROVINCIAS_ESPANA, CCAA_HEADER_MAP } from '../shared/models/provincias';

export interface BoeParsedData {
  titulo: string;
  year: number;
  provincesHolidays: Record<string, FindFestivosProvinciaResponse>;
}

function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node['#text']) return node['#text'].toString();
  if (node.p) return extractText(node.p);
  if (node.strong) return extractText(node.strong);
  if (node.em) return extractText(node.em);
  if (node.b) return extractText(node.b);
  if (node.span) return extractText(node.span);
  return '';
}

function findAbbr(cell: any): any {
  if (!cell) return null;
  if (cell.abbr) return cell.abbr;
  if (cell.p && cell.p.abbr) return cell.p.abbr;
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
  const allRows: any[] = [];
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
    const ths = Array.isArray(row.th) ? row.th : (row.th ? [row.th] : []);
    if (ths.length >= 10) {
      colIndexToCcaa = ths.map((th: any) => {
        const rawId = th['@_id'] || '';
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
    const cells = Array.isArray(row.td) ? row.td : (row.td ? [row.td] : []);
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

      // Check each CCAA cell
      for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        const abbr = findAbbr(cell);
        if (!abbr) continue;

        // Try getting CCAA from @_headers attribute first
        const headersAttr = (cell && typeof cell === 'object') ? (cell['@_headers'] || (cell.p && cell.p['@_headers']) || '') : '';
        let ccaaId = '';
        if (headersAttr) {
          const parts = headersAttr.split(/\s+/);
          const headerPart = parts.find((p: string) => CCAA_HEADER_MAP[p]);
          if (headerPart) ccaaId = CCAA_HEADER_MAP[headerPart];
        }

        // Fallback to column index
        if (!ccaaId && colIndexToCcaa[i - 1]) {
          ccaaId = colIndexToCcaa[i - 1];
        }

        if (!ccaaId || !ccaaHolidays[ccaaId]) continue;

        const abbrTitle = abbr['@_title'] || '';
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
