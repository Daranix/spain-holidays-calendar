export interface Provincia {
  id: string;
  label: string;
  comunidadId: string;
}

export interface ComunidadAutonoma {
  id: string;
  label: string;
  boeHeaderId: string;
}

export const COMUNIDADES_AUTONOMAS: ComunidadAutonoma[] = [
  { id: 'andalucia', label: 'Andalucía', boeHeaderId: 'headerAndalucia' },
  { id: 'aragon', label: 'Aragón', boeHeaderId: 'headerAragon' },
  { id: 'asturias', label: 'Asturias', boeHeaderId: 'headerAsturias' },
  { id: 'baleares', label: 'Illes Balears', boeHeaderId: 'headerBaleares' },
  { id: 'canarias', label: 'Canarias', boeHeaderId: 'headerCanarias' },
  { id: 'cantabria', label: 'Cantabria', boeHeaderId: 'headerCantabria' },
  { id: 'castilla-la-mancha', label: 'Castilla-La Mancha', boeHeaderId: 'headerCastillaLM' },
  { id: 'castilla-y-leon', label: 'Castilla y León', boeHeaderId: 'headerCastillaYL' },
  { id: 'cataluna', label: 'Cataluña', boeHeaderId: 'headerCataluna' },
  { id: 'extremadura', label: 'Extremadura', boeHeaderId: 'headerExtremadura' },
  { id: 'galicia', label: 'Galicia', boeHeaderId: 'headerGalicia' },
  { id: 'madrid', label: 'Comunidad de Madrid', boeHeaderId: 'headerMadrid' },
  { id: 'murcia', label: 'Región de Murcia', boeHeaderId: 'headerMurcia' },
  { id: 'navarra', label: 'Comunidad Foral de Navarra', boeHeaderId: 'headerNavarra' },
  { id: 'pais-vasco', label: 'País Vasco', boeHeaderId: 'headerPaisVasco' },
  { id: 'la-rioja', label: 'La Rioja', boeHeaderId: 'headerRioja' },
  { id: 'valencia', label: 'Comunitat Valenciana', boeHeaderId: 'headerValencia' },
  { id: 'ceuta', label: 'Ciudad Autónoma de Ceuta', boeHeaderId: 'headerCeuta' },
  { id: 'melilla', label: 'Ciudad Autónoma de Melilla', boeHeaderId: 'headerMelilla' },
];

export const PROVINCIAS_ESPANA: Provincia[] = [
  // Andalucía
  { id: 'almeria', label: 'Almería', comunidadId: 'andalucia' },
  { id: 'cadiz', label: 'Cádiz', comunidadId: 'andalucia' },
  { id: 'cordoba', label: 'Córdoba', comunidadId: 'andalucia' },
  { id: 'granada', label: 'Granada', comunidadId: 'andalucia' },
  { id: 'huelva', label: 'Huelva', comunidadId: 'andalucia' },
  { id: 'jaen', label: 'Jaén', comunidadId: 'andalucia' },
  { id: 'malaga', label: 'Málaga', comunidadId: 'andalucia' },
  { id: 'sevilla', label: 'Sevilla', comunidadId: 'andalucia' },

  // Aragón
  { id: 'huesca', label: 'Huesca', comunidadId: 'aragon' },
  { id: 'teruel', label: 'Teruel', comunidadId: 'aragon' },
  { id: 'zaragoza', label: 'Zaragoza', comunidadId: 'aragon' },

  // Asturias
  { id: 'asturias', label: 'Asturias', comunidadId: 'asturias' },

  // Baleares
  { id: 'baleares', label: 'Baleares', comunidadId: 'baleares' },

  // Canarias
  { id: 'las-palmas', label: 'Las Palmas', comunidadId: 'canarias' },
  { id: 'santa-cruz-de-tenerife', label: 'Santa Cruz de Tenerife', comunidadId: 'canarias' },

  // Cantabria
  { id: 'cantabria', label: 'Cantabria', comunidadId: 'cantabria' },

  // Castilla-La Mancha
  { id: 'albacete', label: 'Albacete', comunidadId: 'castilla-la-mancha' },
  { id: 'ciudad-real', label: 'Ciudad Real', comunidadId: 'castilla-la-mancha' },
  { id: 'cuenca', label: 'Cuenca', comunidadId: 'castilla-la-mancha' },
  { id: 'guadalajara', label: 'Guadalajara', comunidadId: 'castilla-la-mancha' },
  { id: 'toledo', label: 'Toledo', comunidadId: 'castilla-la-mancha' },

  // Castilla y León
  { id: 'avila', label: 'Ávila', comunidadId: 'castilla-y-leon' },
  { id: 'burgos', label: 'Burgos', comunidadId: 'castilla-y-leon' },
  { id: 'leon', label: 'León', comunidadId: 'castilla-y-leon' },
  { id: 'palencia', label: 'Palencia', comunidadId: 'castilla-y-leon' },
  { id: 'salamanca', label: 'Salamanca', comunidadId: 'castilla-y-leon' },
  { id: 'segovia', label: 'Segovia', comunidadId: 'castilla-y-leon' },
  { id: 'soria', label: 'Soria', comunidadId: 'castilla-y-leon' },
  { id: 'valladolid', label: 'Valladolid', comunidadId: 'castilla-y-leon' },
  { id: 'zamora', label: 'Zamora', comunidadId: 'castilla-y-leon' },

  // Cataluña
  { id: 'barcelona', label: 'Barcelona', comunidadId: 'cataluna' },
  { id: 'girona', label: 'Girona', comunidadId: 'cataluna' },
  { id: 'lleida', label: 'Lleida', comunidadId: 'cataluna' },
  { id: 'tarragona', label: 'Tarragona', comunidadId: 'cataluna' },

  // Extremadura
  { id: 'badajoz', label: 'Badajoz', comunidadId: 'extremadura' },
  { id: 'caceres', label: 'Cáceres', comunidadId: 'extremadura' },

  // Galicia
  { id: 'a-coruna', label: 'A Coruña', comunidadId: 'galicia' },
  { id: 'lugo', label: 'Lugo', comunidadId: 'galicia' },
  { id: 'ourense', label: 'Ourense', comunidadId: 'galicia' },
  { id: 'pontevedra', label: 'Pontevedra', comunidadId: 'galicia' },

  // Madrid
  { id: 'madrid', label: 'Madrid', comunidadId: 'madrid' },

  // Murcia
  { id: 'murcia', label: 'Murcia', comunidadId: 'murcia' },

  // Navarra
  { id: 'navarra', label: 'Navarra', comunidadId: 'navarra' },

  // País Vasco
  { id: 'alava', label: 'Álava', comunidadId: 'pais-vasco' },
  { id: 'guipuzcoa', label: 'Guipúzcoa', comunidadId: 'pais-vasco' },
  { id: 'vizcaya', label: 'Vizcaya', comunidadId: 'pais-vasco' },

  // La Rioja
  { id: 'la-rioja', label: 'La Rioja', comunidadId: 'la-rioja' },

  // Comunitat Valenciana
  { id: 'alicante', label: 'Alicante', comunidadId: 'valencia' },
  { id: 'castellon', label: 'Castellón', comunidadId: 'valencia' },
  { id: 'valencia', label: 'Valencia', comunidadId: 'valencia' },

  // Ciudades Autónomas
  { id: 'ceuta', label: 'Ceuta', comunidadId: 'ceuta' },
  { id: 'melilla', label: 'Melilla', comunidadId: 'melilla' },
];

export const CCAA_HEADER_MAP: Record<string, string> = {
  // camelCase headers used in BOE 2022-2026
  headerAndalucia: 'andalucia',
  headerAragon: 'aragon',
  headerAsturias: 'asturias',
  headerBaleares: 'baleares',
  headerCanarias: 'canarias',
  headerCantabria: 'cantabria',
  headerCastillaLM: 'castilla-la-mancha',
  headerheaderCastillaLM: 'castilla-la-mancha',
  headerCastillaYL: 'castilla-y-leon',
  headerCataluna: 'cataluna',
  headerCastaluna: 'cataluna',
  headerExtremadura: 'extremadura',
  headerGalicia: 'galicia',
  headerMadrid: 'madrid',
  headerMurcia: 'murcia',
  headerNavarra: 'navarra',
  headerPaisVasco: 'pais-vasco',
  headerRioja: 'la-rioja',
  headerValencia: 'valencia',
  headerCeuta: 'ceuta',
  headerMelilla: 'melilla',

  // Lowercase and compact headers used in BOE 2018-2021
  andalucia: 'andalucia',
  aragon: 'aragon',
  asturias: 'asturias',
  baleares: 'baleares',
  illesbalears: 'baleares',
  illesbaleares: 'baleares',
  canarias: 'canarias',
  cantabria: 'cantabria',
  castillalamancha: 'castilla-la-mancha',
  'castilla-la-mancha': 'castilla-la-mancha',
  castillaleon: 'castilla-y-leon',
  'castilla-y-leon': 'castilla-y-leon',
  cataluña: 'cataluna',
  cataluna: 'cataluna',
  comunitatvalenciana: 'valencia',
  valencia: 'valencia',
  extremadura: 'extremadura',
  galicia: 'galicia',
  madrid: 'madrid',
  murcia: 'murcia',
  navarra: 'navarra',
  paisvasco: 'pais-vasco',
  'pais-vasco': 'pais-vasco',
  larioja: 'la-rioja',
  'la-rioja': 'la-rioja',
  rioja: 'la-rioja',
  ceuta: 'ceuta',
  melilla: 'melilla',
};

