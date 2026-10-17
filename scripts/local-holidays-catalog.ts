import { Mes, meses } from '../shared/models/common';
import { DiaFestivo } from '../shared/models/output/find-festivos-provincia.response';

// Butcher's algorithm to calculate Western Easter Sunday
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

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}

function toLocalHoliday(date: Date, nameFestividad: string): { mes: Mes; holiday: DiaFestivo } {
  const monthIndex = date.getUTCMonth();
  const mes = meses[monthIndex];
  const dia = date.getUTCDate();
  return {
    mes,
    holiday: {
      dia,
      nameFestividad,
      festividad: 'local',
    },
  };
}

export type LocalHolidayEntry = { mes: Mes; holiday: DiaFestivo };
export type HolidayCandidate = { date: Date; name: string };

/**
 * Returns the 2 official patronal local holidays for each Spanish provincial capital.
 * Incorporates traditional fixed dates, movable ecclesiastical dates (Easter, Corpus Christi, Carnaval),
 * and priority alternate candidates when a patronal feast coincides with a national or autonomic holiday.
 */
export function getLocalHolidaysForCapital(
  provinciaId: string,
  year: number,
  isOccupied?: (mes: Mes, dia: number) => boolean
): LocalHolidayEntry[] {
  const easter = getEasterSunday(year);

  // Common movable holidays
  const martesCarnaval = addDays(easter, -47);
  const lunesCarnaval = addDays(easter, -48);
  const miercolesCeniza = addDays(easter, -46);
  const martesPascua = addDays(easter, 2);
  const sanVicenteFerrer = addDays(easter, 8); // Segundo lunes de Pascua
  const santaFaz = addDays(easter, 11); // Segundo jueves de Pascua (Alicante)
  const santaFazViernes = addDays(easter, 12);
  const miercolesFeriaSevilla = addDays(easter, 24); // Miércoles de Feria de Abril
  const segundaPascua = addDays(easter, 50); // Lunes de Pentecostés
  const martesCampo = addDays(easter, 51); // Martes de Campo (Oviedo)
  const corpusChristi = addDays(easter, 60); // Jueves de Corpus
  const curpillos = addDays(corpusChristi, 1); // Viernes siguiente a Corpus (Burgos)

  const entries: LocalHolidayEntry[] = [];

  const pickCandidate = (candidates: HolidayCandidate[]) => {
    for (const c of candidates) {
      const entry = toLocalHoliday(c.date, c.name);
      const collidesWithSelected = entries.some(e => e.mes === entry.mes && e.holiday.dia === entry.holiday.dia);
      const collidesWithExisting = isOccupied ? isOccupied(entry.mes, entry.holiday.dia) : false;
      if (!collidesWithSelected && !collidesWithExisting) {
        entries.push(entry);
        return;
      }
    }
    // Fallback: search nearby days to avoid collision
    if (candidates.length > 0) {
      let offset = 1;
      while (offset < 7) {
        const fallbackDate = addDays(candidates[0].date, offset);
        const entry = toLocalHoliday(fallbackDate, candidates[0].name);
        const collidesWithSelected = entries.some(e => e.mes === entry.mes && e.holiday.dia === entry.holiday.dia);
        const collidesWithExisting = isOccupied ? isOccupied(entry.mes, entry.holiday.dia) : false;
        if (!collidesWithSelected && !collidesWithExisting) {
          entries.push(entry);
          return;
        }
        offset++;
      }
      entries.push(toLocalHoliday(addDays(candidates[0].date, 1), candidates[0].name));
    }
  };

  switch (provinciaId) {
    case 'a-coruna':
      pickCandidate([{ date: martesCarnaval, name: 'Martes de Carnaval' }]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' },
        { date: new Date(Date.UTC(year, 9, 7)), name: 'Virgen del Rosario' },
      ]);
      break;

    case 'alava':
      pickCandidate([{ date: new Date(Date.UTC(year, 3, 28)), name: 'San Prudencio' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 5)), name: 'Nuestra Señora la Virgen Blanca' }]);
      break;

    case 'albacete':
      pickCandidate([
        { date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan Bautista' },
        { date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de los Llanos' },
      ]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de los Llanos' },
        { date: new Date(Date.UTC(year, 8, 9)), name: 'Día posterior a la Virgen de los Llanos' },
      ]);
      break;

    case 'alicante':
      pickCandidate([
        { date: santaFaz, name: 'Romería de Santa Faz' },
        { date: santaFazViernes, name: 'Viernes de Santa Faz' },
      ]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' },
        { date: sanVicenteFerrer, name: 'San Vicente Ferrer' },
        { date: new Date(Date.UTC(year, 11, 6)), name: 'San Nicolás de Bari' },
        { date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro' },
      ]);
      break;

    case 'almeria':
      pickCandidate([
        { date: new Date(Date.UTC(year, 7, 29)), name: 'Virgen del Mar' },
        { date: new Date(Date.UTC(year, 7, 28)), name: 'Viernes de Virgen del Mar' },
      ]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 11, 26)), name: 'Día del Pendón' },
        { date: new Date(Date.UTC(year, 11, 28)), name: 'Santos Inocentes' },
      ]);
      break;

    case 'asturias': // Oviedo
      pickCandidate([{ date: martesCampo, name: 'Martes de Campo (La Balesquida)' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 21)), name: 'San Mateo' }]);
      break;

    case 'avila':
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 2)), name: 'San Segundo' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 15)), name: 'Santa Teresa de Jesús' }]);
      break;

    case 'badajoz':
      pickCandidate([{ date: martesCarnaval, name: 'Martes de Carnaval' }]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' },
        { date: new Date(Date.UTC(year, 2, 19)), name: 'San José' },
        { date: new Date(Date.UTC(year, 8, 18)), name: 'Virgen de la Soledad' },
      ]);
      break;

    case 'baleares': // Palma de Mallorca
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 20)), name: 'San Sebastián' }]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 11, 26)), name: 'Segunda Fiesta de Navidad' },
        { date: new Date(Date.UTC(year, 8, 8)), name: 'Mare de Déu de la Salut' },
        { date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro' },
      ]);
      break;

    case 'barcelona':
      pickCandidate([
        { date: segundaPascua, name: 'Segunda Pascua (Pascua Granada)' },
        { date: new Date(Date.UTC(year, 3, 23)), name: 'Sant Jordi' },
        { date: new Date(Date.UTC(year, 8, 25)), name: 'Día siguiente a La Mercè' },
      ]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 24)), name: 'La Mercè' }]);
      break;

    case 'burgos':
      pickCandidate([{ date: curpillos, name: 'El Curpillos' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro y San Pablo' }]);
      break;

    case 'caceres':
      pickCandidate([{ date: new Date(Date.UTC(year, 3, 23)), name: 'San Jorge' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 29)), name: 'Feria de San Fernando' }]);
      break;

    case 'cadiz':
      pickCandidate([
        { date: lunesCarnaval, name: 'Lunes de Carnaval' },
        { date: martesCarnaval, name: 'Martes de Carnaval' },
      ]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 7)), name: 'Virgen del Rosario' }]);
      break;

    case 'cantabria': // Santander
      pickCandidate([
        { date: new Date(Date.UTC(year, 6, 25)), name: 'Santiago Apóstol' },
        { date: segundaPascua, name: 'Virgen del Mar' },
      ]);
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 30)), name: 'Santos Mártires Emeterio y Celedonio' }]);
      break;

    case 'castellon':
      pickCandidate([{ date: addDays(easter, -20), name: 'Fiestas de la Magdalena' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro' }]);
      break;

    case 'ceuta':
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 13)), name: 'San Antonio' }]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 7, 5)), name: 'Nuestra Señora de África' },
        { date: new Date(Date.UTC(year, 8, 2)), name: 'Día de Ceuta' },
        { date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' },
      ]);
      break;

    case 'ciudad-real':
      pickCandidate([{ date: segundaPascua, name: 'Lunes del Alarcos' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 22)), name: 'Octava de la Virgen del Prado' }]);
      break;

    case 'cordoba':
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de la Fuensanta' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 24)), name: 'San Rafael' }]);
      break;

    case 'cuenca':
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 28)), name: 'San Julián' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 21)), name: 'San Mateo' }]);
      break;

    case 'girona':
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 25)), name: 'San Jaime' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 29)), name: 'San Narciso' }]);
      break;

    case 'granada':
      pickCandidate([
        { date: new Date(Date.UTC(year, 0, 2)), name: 'Día de la Toma' },
        { date: new Date(Date.UTC(year, 1, 1)), name: 'San Cecilio' },
      ]);
      pickCandidate([
        { date: corpusChristi, name: 'Corpus Christi' },
        { date: new Date(Date.UTC(year, 4, 26)), name: 'Mariana Pineda' },
      ]);
      break;

    case 'guadalajara':
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de la Antigua' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 18)), name: 'Viernes de Ferias' }]);
      break;

    case 'guipuzcoa': // San Sebastián
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 20)), name: 'San Sebastián' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 31)), name: 'San Ignacio de Loyola' }]);
      break;

    case 'huelva':
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 3)), name: 'Fiestas Colombinas' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Nuestra Señora de la Cinta' }]);
      break;

    case 'huesca':
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 22)), name: 'San Vicente' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 10)), name: 'San Lorenzo' }]);
      break;

    case 'jaen':
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 11)), name: 'Virgen de la Capilla' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 18)), name: 'San Lucas' }]);
      break;

    case 'la-rioja': // Logroño
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 11)), name: 'San Bernabé' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 21)), name: 'San Mateo' }]);
      break;

    case 'las-palmas': // Las Palmas de Gran Canaria
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Nuestra Señora del Pino' }]);
      break;

    case 'leon':
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 24)), name: 'San Juan' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 5)), name: 'San Froilán' }]);
      break;

    case 'lleida':
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 11)), name: 'San Anastasio' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 29)), name: 'San Miguel' }]);
      break;

    case 'lugo':
      pickCandidate([{ date: martesCarnaval, name: 'Martes de Carnaval' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 5)), name: 'San Froilán' }]);
      break;

    case 'madrid':
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 15)), name: 'San Isidro Labrador' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 10, 9)), name: 'Nuestra Señora de la Almudena' }]);
      break;

    case 'malaga':
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 19)), name: 'Toma de Málaga' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de la Victoria' }]);
      break;

    case 'melilla':
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de la Victoria' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 17)), name: 'Día de Melilla' }]);
      break;

    case 'murcia':
      pickCandidate([{ date: martesPascua, name: 'Bando de la Huerta' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 15)), name: 'Romería de la Fuensanta' }]);
      break;

    case 'navarra': // Pamplona
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 7)), name: 'San Fermín' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 10, 29)), name: 'San Saturnino' }]);
      break;

    case 'ourense':
      pickCandidate([{ date: martesCarnaval, name: 'Martes de Carnaval' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 10, 11)), name: 'San Martín' }]);
      break;

    case 'palencia':
      pickCandidate([{ date: new Date(Date.UTC(year, 1, 2)), name: 'Virgen de la Calle' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 2)), name: 'San Antolín' }]);
      break;

    case 'pontevedra':
      pickCandidate([{ date: miercolesCeniza, name: 'Miércoles de Ceniza' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 11)), name: 'San Benito' }]);
      break;

    case 'salamanca':
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 12)), name: 'San Juan de Sahagún' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de la Vega' }]);
      break;

    case 'santa-cruz-de-tenerife':
      pickCandidate([{ date: martesCarnaval, name: 'Martes de Carnaval' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 3)), name: 'Día de la Cruz' }]);
      break;

    case 'segovia':
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 25)), name: 'San Frutos' }]);
      break;

    case 'sevilla':
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 30)), name: 'San Fernando' }]);
      pickCandidate([
        { date: corpusChristi, name: 'Corpus Christi' },
        { date: miercolesFeriaSevilla, name: 'Miércoles de Feria de Abril' },
      ]);
      break;

    case 'soria':
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 6)), name: 'Lunes de Bailas' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 9, 2)), name: 'San Saturio' }]);
      break;

    case 'tarragona':
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 19)), name: 'San Magín' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 23)), name: 'Santa Tecla' }]);
      break;

    case 'teruel':
      pickCandidate([{ date: martesPascua, name: 'Sermón de las Tortillas' }]);
      pickCandidate([
        { date: new Date(Date.UTC(year, 6, 13)), name: 'La Vaquilla del Ángel' },
        { date: new Date(Date.UTC(year, 4, 30)), name: 'San Fernando' },
      ]);
      break;

    case 'toledo':
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 23)), name: 'San Ildefonso' }]);
      pickCandidate([
        { date: corpusChristi, name: 'Corpus Christi' },
        { date: sanVicenteFerrer, name: 'Romería de la Virgen del Valle' },
        { date: new Date(Date.UTC(year, 11, 9)), name: 'Santa Leocadia' },
      ]);
      break;

    case 'valencia':
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 22)), name: 'San Vicente Mártir' }]);
      pickCandidate([{ date: sanVicenteFerrer, name: 'San Vicente Ferrer' }]);
      break;

    case 'valladolid':
      pickCandidate([{ date: new Date(Date.UTC(year, 4, 13)), name: 'San Pedro Regalado' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 8, 8)), name: 'Virgen de San Lorenzo' }]);
      break;

    case 'vizcaya': // Bilbao
      pickCandidate([{ date: new Date(Date.UTC(year, 6, 31)), name: 'San Ignacio de Loyola' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 7, 28)), name: 'Viernes de la Semana Grande' }]);
      break;

    case 'zamora':
      pickCandidate([{ date: segundaPascua, name: 'La Hiniesta' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro' }]);
      break;

    case 'zaragoza':
      pickCandidate([{ date: new Date(Date.UTC(year, 0, 29)), name: 'San Valero' }]);
      pickCandidate([{ date: new Date(Date.UTC(year, 2, 5)), name: 'Cincomarzada' }]);
      break;

    default:
      break;
  }

  return entries;
}
