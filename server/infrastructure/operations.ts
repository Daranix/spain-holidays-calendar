import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseISO, compareDesc } from 'date-fns';
import fm from 'front-matter';
import { HttpError } from "../utils";
import { FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";

// Definimos la interfaz para los atributos del blog para evitar errores de 'unknown'
interface BlogAttributes {
  title?: string;
  description?: string;
  date?: string;
  lastMod?: string;
  [key: string]: any;
}

// Dynamic assets path resolution (dev src/assets vs production dist/browser/assets)
const BLOG_ASSETS_PATH = (() => {
  const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = path.resolve(serverDistFolder, '../browser');
  const distPath = path.join(browserDistFolder, 'assets/blog');

  if (fs.existsSync(distPath)) {
    return distPath;
  }

  const devPath = path.resolve(process.cwd(), 'src/assets/blog');
  if (fs.existsSync(devPath)) {
    return devPath;
  }

  return path.resolve(process.cwd(), 'dist/browser/assets/blog');
})();

const DATA_ASSETS_PATH = (() => {
  const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = path.resolve(serverDistFolder, '../browser');
  const distPath = path.join(browserDistFolder, 'assets/data');

  if (fs.existsSync(distPath)) {
    return distPath;
  }

  const devPath = path.resolve(process.cwd(), 'src/assets/data');
  if (fs.existsSync(devPath)) {
    return devPath;
  }

  return path.resolve(process.cwd(), 'dist/browser/assets/data');
})();

export async function findFestivosProvincia(provincia: string, year: number): Promise<FindFestivosProvinciaResponse> {
  const yearFile = path.join(DATA_ASSETS_PATH, 'festivos', `${year}.json`);
  if (!fs.existsSync(yearFile)) {
    throw new HttpError(`Festivos not found for year ${year}`, 404);
  }

  const raw = fs.readFileSync(yearFile, 'utf-8');
  const yearData = JSON.parse(raw);
  const provinceData = yearData[provincia.toLowerCase()];

  if (!provinceData) {
    throw new HttpError(`Festivos not found for ${provincia} in ${year}`, 404);
  }

  return provinceData;
}

export async function getProvincias(): Promise<FindProvinciasResponse> {
  const provFile = path.join(DATA_ASSETS_PATH, 'provincias.json');
  if (!fs.existsSync(provFile)) {
    throw new HttpError('Provincias dataset not found', 404);
  }

  const raw = fs.readFileSync(provFile, 'utf-8');
  return JSON.parse(raw) as FindProvinciasResponse;
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
