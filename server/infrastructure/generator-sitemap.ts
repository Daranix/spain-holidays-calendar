import { format } from "date-fns";
import { getBlogPosts, getProvincias, getYears } from "./operations";

interface SitemapEntry {
    path: string;
    lastMod?: string;
}

export async function generateSiteMap(): Promise<string> {
    
    const basePath = process.env['BASE_URL'];
    const today = format(new Date(), 'yyyy-MM-dd');

    const entries: SitemapEntry[] = [
        { path: '/', lastMod: today },
        { path: '/blog', lastMod: today },
        { path: '/acerca-de', lastMod: today },
        { path: '/politica-privacidad', lastMod: today },
        { path: '/contacto', lastMod: today }
    ];


    const [years, provincias, blogPosts] = await Promise.all([
        getYears(),
        getProvincias(),
        getBlogPosts()
    ]);

    const currentYear = new Date().getFullYear();
    const sortedYears = [...years].sort((a, b) => {
        if (a.year === currentYear) return -1;
        if (b.year === currentYear) return 1;
        return b.year - a.year; // Descending for the rest
    });

    // Artículos del Blog con su lastMod real
    for (const post of blogPosts) {
        entries.push({ 
            path: `/blog/${post.slug}`, 
            lastMod: post.lastMod || post.date || today 
        });
    }

    // Páginas de festivos (por provincia y año)
    for (const yearData of sortedYears) {
        for (const provincia of provincias) {
            entries.push({ path: `/festivos/${provincia.id}/${yearData.year}`, lastMod: today });
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${entries.map((entry) => {
                 const rawDate = entry.lastMod || today;
                 const modDate = format(new Date(rawDate), 'yyyy-MM-dd');
                 return `
                 <url>
                     <loc>${`${basePath}${entry.path}`}</loc>
                     <lastmod>${modDate}</lastmod>
                 </url>
                 `;
             })
             .join('')}
    </urlset>
  `;

  return xml.replace(/>\s+</g, '><').trim();
}