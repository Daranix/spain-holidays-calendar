import minify from "minify-xml";
import { getProvincias, getYears } from "./operations";

export async function generateSiteMap(): Promise<string> {
    
    const basePath = process.env['BASE_URL'];

    const paths = [
        '/'
    ];


    const [years, provincias] = await Promise.all([
        getYears(),
        getProvincias()
    ]);

    for (const year of years) {
        for (const provincia of provincias) {
            paths.push(`/festivos/${provincia}/${year}`);
        }
    }


    const lastMod = new Date().toISOString();
    
    return minify(`<?xml version="1.0" encoding="UTF-8"?>
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
  `);
}