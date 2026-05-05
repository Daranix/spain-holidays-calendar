import fs from 'node:fs';
import path from 'node:path';
import { parseISO, compareDesc } from 'date-fns';
import fm from 'front-matter';
import { parseHTML } from 'linkedom';
import { capitalize, decodeHTMLEntities, HttpError } from "../utils";
import { Mes, meses, TipoFestividad, HOLIDAY_MAP } from '@/shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";

// Definimos la interfaz para los atributos del blog para evitar errores de 'unknown'
interface BlogAttributes {
  title?: string;
  description?: string;
  date?: string;
  lastMod?: string;
  [key: string]: any;
}

// En el entorno de SSR, calculamos la ruta base de los assets del blog
const BLOG_ASSETS_PATH = path.resolve(process.cwd(), 'src/assets/blog');

export async function findFestivosProvincia(provincia: string, year: number): Promise<FindFestivosProvinciaResponse> {
  try {
    const response = await fetch(
      `https://www.calendarioslaborales.com/calendario-laboral-${provincia}-${year}.htm`,
    );

    if (!response.ok) {
      throw new HttpError(`${provincia} not found for year ${year}`, 404);
    }

    const html = await response.text();
    const { document } = parseHTML(html);

    const monthElements = Array.from(document.querySelectorAll('.month'));

    if (monthElements.length === 0) {
      throw new HttpError(`${provincia} not found`, 404);
    }

    const mapFestivos: Map<Mes, Array<DiaFestivo>> = new Map();
    for (const element of monthElements) {
      const monthNameText = element.querySelector('.month-name')?.textContent?.trim().toLowerCase() as Mes;

      if (!monthNameText || !meses.includes(monthNameText)) {
        continue;
      }

      const holidayItems = Array.from(element.querySelectorAll('.month-holidays li'));

      const listaFestivos = holidayItems.map((li) => {
        const span = (li as Element).querySelector('span');
        if (!span) return null;

        const dateText = span.textContent?.trim() || ''; 
        const diaString = dateText.split(' de ')[0];
        const dia = Number.parseInt(diaString);

        if (Number.isNaN(dia)) return null;

        const fullText = (li as Element).textContent?.trim() || '';
        const nameFestividad = fullText.replace(dateText, '').replace(/^[–\s-]+/, '').trim();

        const classAttr = span.getAttribute('class') || '';
        const holidayKey = (Object.keys(HOLIDAY_MAP) as Array<keyof typeof HOLIDAY_MAP>)
          .find(cls => classAttr.includes(cls));

        const festividad: TipoFestividad = holidayKey ? HOLIDAY_MAP[holidayKey].val : 'local';

        return { dia, nameFestividad, festividad };
      }).filter(f => f !== null) as Array<DiaFestivo>;

      mapFestivos.set(monthNameText, listaFestivos);
    }

    return Object.fromEntries(mapFestivos.entries());
  } catch (ex) {
    if (ex instanceof HttpError) throw ex;
    const err = ex as any;
    throw new HttpError(err.message, err.statusCode || 500);
  }
}

export async function getProvincias(): Promise<FindProvinciasResponse> {
  const currentYear = new Date().getFullYear();
  const response = await fetch(`https://www.calendarioslaborales.com/calendarios-laborales-${currentYear}-por-provincias.htm`, {
    method: "GET",
  });

  if (!response.ok) {
    const fallbackResponse = await fetch("https://www.calendarioslaborales.com/calendarios-laborales-2026-por-provincias.htm");
    if (!fallbackResponse.ok) return [];
    return parseProvincias(await fallbackResponse.text());
  }

  return parseProvincias(await response.text());
}

function parseProvincias(html: string): FindProvinciasResponse {
  const { document } = parseHTML(html);
  const elements = document.querySelectorAll('.calendar-geo-card');

  return Array.from(elements).map((e) => {
    const href = e.getAttribute('href') || '';
    const id = href.replace(/^\//, '').replace('calendario-laboral-', '').replace(/-20\d{2}\.htm$/, '');
    return {
      id: id,
      label: e.querySelector('.calendar-geo-title')?.textContent?.trim() || id,
    };
  }).filter(p => p.id && p.label);
}

export async function getYears() {
  const startYear = 2005;
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 6;

  const yearsData = [];
  for (let year = endYear; year >= startYear; year--) {
    let groupName = "Anteriores";
    if (year === currentYear) {
      groupName = "Año actual";
    } else if (year > currentYear) {
      groupName = "Próximos años";
    } else if (year >= currentYear - 2) {
      groupName = "Recientes";
    }

    yearsData.push({ year, groupName });
  }

  return yearsData;
}

export async function getBlogPosts() {
  if (!fs.existsSync(BLOG_ASSETS_PATH)) return [];
  
  const files = fs.readdirSync(BLOG_ASSETS_PATH);
  const mdFiles = files.filter(file => file.endsWith('.md'));

  const posts = mdFiles.map(file => {
    const filePath = path.join(BLOG_ASSETS_PATH, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fm<BlogAttributes>(content);
    const { attributes } = result;

    return {
      slug: file.replace('.md', ''),
      title: attributes.title || 'Sin título',
      description: attributes.description || '',
      date: attributes.date || '',
      ...attributes
    };
  });

  return posts.sort((a, b) => {
    const dateA = a.date ? parseISO(a.date) : new Date(0);
    const dateB = b.date ? parseISO(b.date) : new Date(0);
    return compareDesc(dateA, dateB);
  });
}

export async function getBlogPost(slug: string): Promise<string> {
  const filePath = path.join(BLOG_ASSETS_PATH, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new HttpError('Post not found', 404);
  }
  return fs.readFileSync(filePath, 'utf8');
}
