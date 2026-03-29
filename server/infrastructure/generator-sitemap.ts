import { getProvincias, getYears } from "./operations";

export async function generateSiteMap(): Promise<string> {
    
    const basePath = process.env['BASE_URL'];

    const paths = [
        '/',
        '/acerca-de',
        '/politica-privacidad',
        '/contacto'
    ];


    const [years, provincias] = await Promise.all([
        getYears(),
        getProvincias()
    ]);

    const currentYear = new Date().getFullYear();
    const sortedYears = [...years].sort((a, b) => {
        if (a.year === currentYear) return -1;
        if (b.year === currentYear) return 1;
        return b.year - a.year; // Descending for the rest
    });

    for (const yearData of sortedYears) {
        for (const provincia of provincias) {
            paths.push(`/festivos/${provincia.id}/${yearData.year}`);
        }
    }


    const lastMod = new Date().toISOString();
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths.map((path) => {
                 return `
                 <url>
                     <loc>${`${basePath}${path}`}</loc>
                     <lastmod>${lastMod}</lastmod>
                 </url>
                 `;
             })
             .join('')}
    </urlset>
  `;

  return xml.replace(/>\s+</g, '><').trim();
}