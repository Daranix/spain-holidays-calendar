import { parseHTML } from 'linkedom';
import { capitalize, decodeHTMLEntities, HttpError } from "../utils";
import { Mes, meses, TipoFestividad } from '@/shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";

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

                const dateText = span.textContent?.trim() || ''; // e.g. "01 de enero"
                const diaString = dateText.split(' de ')[0];
                const dia = Number.parseInt(diaString);

                if (Number.isNaN(dia)) return null;

                const fullText = (li as Element).textContent?.trim() || '';
                // The name is after the date and the separator (– or -)
                const nameFestividad = fullText.replace(dateText, '').replace(/^[–\s-]+/, '').trim();

                const classAttr = span.getAttribute('class') || '';
                const festividad: TipoFestividad =
                    classAttr.includes('national') ? 'nacional' :
                        classAttr.includes('regional') ? 'regional' :
                            classAttr.includes('provincial') ? 'provincial' :
                                classAttr.includes('local') ? 'local' : 'local';

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
        // Fallback to a plain URL if the year-specific one fails
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
        // href is like "/calendario-laboral-madrid-2026.htm"
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
