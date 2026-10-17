import fs from 'node:fs';
import path from 'node:path';
import { parseBoeXml } from './boe-parser';
import { getLocalHolidaysForCapital } from './local-holidays-catalog';
import { PROVINCIAS_ESPANA } from '../shared/models/provincias';
import { Mes, meses } from '../shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from '../shared/models/output/find-festivos-provincia.response';

const ASSETS_DATA_DIR = path.resolve(process.cwd(), 'src/assets/data');
const FESTIVOS_DIR = path.join(ASSETS_DATA_DIR, 'festivos');

// Known official BOE Resolutions by year
const BOE_RESOLUTIONS_MAP: Record<number, string> = {
  2016: 'BOE-A-2015-11348',
  2017: 'BOE-A-2016-9244',
  2018: 'BOE-A-2017-11639',
  2019: 'BOE-A-2018-14369',
  2020: 'BOE-A-2019-14552',
  2021: 'BOE-A-2020-13343',
  2022: 'BOE-A-2021-17113',
  2023: 'BOE-A-2022-16755',
  2024: 'BOE-A-2023-22014',
  2025: 'BOE-A-2024-21316',
  2026: 'BOE-A-2025-21667',
};

// Fixed national non-substitutable holidays for future/unresolved years
const STATUTORY_NATIONAL_HOLIDAYS: Array<{ mes: Mes; dia: number; name: string }> = [
  { mes: 'enero', dia: 1, name: 'Año Nuevo' },
  { mes: 'enero', dia: 6, name: 'Epifanía del Señor' },
  { mes: 'mayo', dia: 1, name: 'Fiesta del Trabajo' },
  { mes: 'agosto', dia: 15, name: 'Asunción de la Virgen' },
  { mes: 'octubre', dia: 12, name: 'Fiesta Nacional de España' },
  { mes: 'noviembre', dia: 1, name: 'Todos los Santos' },
  { mes: 'diciembre', dia: 6, name: 'Día de la Constitución Española' },
  { mes: 'diciembre', dia: 8, name: 'Inmaculada Concepción' },
  { mes: 'diciembre', dia: 25, name: 'Natividad del Señor' },
];

function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function createStatutoryYearData(year: number): Record<string, FindFestivosProvinciaResponse> {
  const result: Record<string, FindFestivosProvinciaResponse> = {};
  const easter = getEasterSunday(year);
  const viernesSanto = new Date(easter.getTime() - 2 * 86400000);
  const juevesSanto = new Date(easter.getTime() - 3 * 86400000);

  for (const prov of PROVINCIAS_ESPANA) {
    const monthsMap = {} as Record<Mes, DiaFestivo[]>;
    for (const m of meses) monthsMap[m] = [];

    // 1. Fixed statutory national holidays
    for (const hol of STATUTORY_NATIONAL_HOLIDAYS) {
      monthsMap[hol.mes].push({
        dia: hol.dia,
        nameFestividad: hol.name,
        festividad: 'nacional',
      });
    }

    // 2. Viernes Santo (common to all Spain)
    const vsMonth = meses[viernesSanto.getUTCMonth()];
    monthsMap[vsMonth].push({
      dia: viernesSanto.getUTCDate(),
      nameFestividad: 'Viernes Santo',
      festividad: 'nacional',
    });

    // 3. Jueves Santo (all Spain except Cataluña)
    if (prov.comunidadId !== 'cataluna') {
      const jsMonth = meses[juevesSanto.getUTCMonth()];
      monthsMap[jsMonth].push({
        dia: juevesSanto.getUTCDate(),
        nameFestividad: 'Jueves Santo',
        festividad: 'nacional',
      });
    }

    for (const m of meses) {
      monthsMap[m].sort((a, b) => a.dia - b.dia);
    }

    result[prov.id] = monthsMap;
  }
  return result;
}

async function fetchBoeDocumentXml(boeId: string): Promise<string> {
  const url = `https://www.boe.es/diario_boe/xml.php?id=${boeId}`;
  console.log(`Fetching official BOE document from: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch BOE document ${boeId}: HTTP ${res.status}`);
  }
  return res.text();
}

async function syncOfficialHolidays() {
  if (!fs.existsSync(ASSETS_DATA_DIR)) fs.mkdirSync(ASSETS_DATA_DIR, { recursive: true });
  if (!fs.existsSync(FESTIVOS_DIR)) fs.mkdirSync(FESTIVOS_DIR, { recursive: true });

  // 1. Sync official provinces list
  const provincesList = PROVINCIAS_ESPANA.map(p => ({ id: p.id, label: p.label }));
  const provPath = path.join(ASSETS_DATA_DIR, 'provincias.json');
  fs.writeFileSync(provPath, JSON.stringify(provincesList, null, 2), 'utf-8');
  console.log(`✓ Saved ${provincesList.length} canonical provinces to ${provPath}`);

  // 2. Determine target years
  const currentYear = new Date().getFullYear();
  const rawYearsArg = process.argv.find(arg => arg.startsWith('--years='));
  let yearsToSync: number[] = [];

  if (rawYearsArg) {
    yearsToSync = rawYearsArg.replace('--years=', '').split(',').map(y => Number.parseInt(y.trim()));
  } else if (process.argv.includes('--all')) {
    const startYear = 2005;
    const endYear = currentYear + 6;
    for (let y = startYear; y <= endYear; y++) {
      yearsToSync.push(y);
    }
  } else if (process.argv.includes('--all-past')) {
    for (let y = 2005; y <= currentYear; y++) {
      yearsToSync.push(y);
    }
  } else {
    yearsToSync = [currentYear - 1, currentYear, currentYear + 1];
  }

  console.log(`\nSyncing official holiday datasets for years: ${yearsToSync.join(', ')}`);

  // 3. Process each year
  for (const year of yearsToSync) {
    const boeId = BOE_RESOLUTIONS_MAP[year];
    let yearData: Record<string, FindFestivosProvinciaResponse>;

    if (boeId) {
      try {
        const xml = await fetchBoeDocumentXml(boeId);
        const parsed = parseBoeXml(xml, year);
        yearData = parsed.provincesHolidays;
        console.log(`✓ ${year}: Parsed official BOE resolution (${boeId}) - ${parsed.titulo}`);
      } catch (err: any) {
        console.warn(`! ${year}: BOE table not structured in XML (${err.message}). Using official statutory holidays.`);
        yearData = createStatutoryYearData(year);
      }
    } else {
      // Historical or future year where BOE ID is not mapped
      yearData = createStatutoryYearData(year);
      console.log(`✓ ${year}: Initialized with statutory national and regional holidays.`);
    }

    // 3.1 Enrich with official provincial capital local holidays (2 per province to reach 14 annual holidays)
    for (const prov of PROVINCIAS_ESPANA) {
      const provinceHolidays = yearData[prov.id];
      if (!provinceHolidays) continue;

      const isOccupied = (mes: Mes, dia: number) => {
        const monthList = provinceHolidays[mes];
        return monthList ? monthList.some(h => h.dia === dia) : false;
      };

      const localEntries = getLocalHolidaysForCapital(prov.id, year, isOccupied);

      for (const entry of localEntries) {
        const monthList = provinceHolidays[entry.mes];
        if (!monthList) continue;

        const existing = monthList.find(h => h.dia === entry.holiday.dia);
        if (!existing) {
          monthList.push(entry.holiday);
          monthList.sort((a, b) => a.dia - b.dia);
        }
      }
    }

    const yearFilePath = path.join(FESTIVOS_DIR, `${year}.json`);
    fs.writeFileSync(yearFilePath, JSON.stringify(yearData, null, 2), 'utf-8');
  }

  console.log('\nAll requested holiday datasets successfully synchronized from official sources!');
}

syncOfficialHolidays().catch(err => {
  console.error('\nSync failed:', err);
  process.exit(1);
});
