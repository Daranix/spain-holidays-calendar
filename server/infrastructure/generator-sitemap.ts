import { format } from "date-fns";
import { getBlogPosts, getProvincias, getYears } from "./operations";

const PRODUCTION_BASE_URL = 'https://www.calendariovacaciones.com';

interface SitemapEntry {
    path: string;
    lastMod?: string;
    priority?: number;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export async function generateSiteMap(): Promise<string> {

    const envBaseUrl = process.env['BASE_URL'];
    const basePath = envBaseUrl?.startsWith('https') ? envBaseUrl : PRODUCTION_BASE_URL;
    const today = format(new Date(), 'yyyy-MM-dd');

    const entries: SitemapEntry[] = [
        { path: '/', lastMod: today, priority: 1.0, changefreq: 'daily' },
        { path: '/blog', lastMod: today, priority: 0.8, changefreq: 'weekly' },
        { path: '/calculadora-puentes', lastMod: today, priority: 0.7, changefreq: 'monthly' },
        { path: '/acerca-de', lastMod: today, priority: 0.4, changefreq: 'yearly' },
        { path: '/contacto', lastMod: today, priority: 0.4, changefreq: 'yearly' },
        { path: '/politica-privacidad', lastMod: today, priority: 0.2, changefreq: 'yearly' },
        { path: '/politica-cookies', lastMod: today, priority: 0.2, changefreq: 'yearly' },
        { path: '/terminos-condiciones', lastMod: today, priority: 0.2, changefreq: 'yearly' },
        { path: '/desarrolladores', lastMod: today, priority: 0.3, changefreq: 'monthly' }
    ];


    const [years, provincias, blogPosts] = await Promise.all([
        getYears(),
        getProvincias(),
        getBlogPosts()
    ]);

    const currentYear = new Date().getFullYear();

    for (const post of blogPosts) {
        entries.push({
            path: `/blog/${post.slug}`,
            lastMod: post.lastMod || post.date || today,
            priority: 0.7,
            changefreq: 'monthly'
        });
    }

    for (const yearData of years) {
        const isCurrent = yearData.year === currentYear;
        const isRecent = yearData.year >= currentYear - 1 && yearData.year <= currentYear + 1;

        for (const provincia of provincias) {
            entries.push({
                path: `/festivos/${provincia.id}/${yearData.year}`,
                lastMod: today,
                priority: isCurrent ? 0.9 : isRecent ? 0.7 : 0.5,
                changefreq: isCurrent ? 'monthly' : 'yearly'
            });
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => {
    const modDate = format(new Date(entry.lastMod || today), 'yyyy-MM-dd');
    return `  <url>
    <loc>${basePath}${entry.path}</loc>
    <lastmod>${modDate}</lastmod>
    <priority>${entry.priority ?? 0.5}</priority>
    <changefreq>${entry.changefreq ?? 'monthly'}</changefreq>
  </url>`;
}).join('\n')}
</urlset>`;

  return xml.replace(/>\s+</g, '><').trim();
}
