import { DOMParser } from "@xmldom/xmldom";
import * as xpath from "xpath";
import { capitalize, decodeHTMLEntities } from "../utils";
import { Mes, TipoFestividad } from '@/shared/models/common';
import { DiaFestivo, FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";

const domParserArgs = {
    locator: {},
    errorHandler: {
        warning: (w: Error) => { },
        error: (e: Error) => { },
        fatalError: (e: Error) => { console.error(e) }
    }
}

export async function findFestivosProvincia(provincia: string, year: number): Promise<FindFestivosProvinciaResponse> {
    
    const response = await fetch(
        `https://www.calendarioslaborales.com/calendario-laboral-${provincia}-${year}.htm`,
    );

    console.log('Hola');

    const html = await response.text();
    const doc = new DOMParser(domParserArgs).parseFromString(html);

    const festivoElements = xpath.select(`//*/div[starts-with(@id, 'wrap') and @class='mes']`, doc) as Array<Element>;

    const mapFestivos: Map<Mes, Array<DiaFestivo>> = new Map();
    for (const element of festivoElements) {

        const mes = element.getAttribute('id')!.slice('wrap'.length).toLowerCase();

        // const nMes = meses.indexOf(mes as Mes);
        const listadoFestivosElement: Element | undefined = (xpath.select(`//*/div[@id='wrap${capitalize(mes)}']/div[@class='wrapFestivos']/ul`, element) as Element[])[0]

        const listaFestivos = Array.from(listadoFestivosElement?.childNodes || []).map((li) => {
            const span = li.firstChild! as Element;
            const dia = Number.parseInt(span.firstChild!.nodeValue!.split(' de ')[0]);
            const nameFestividad = li.lastChild!.nodeValue!;
            const tipoFestividad = span.getAttribute('class');
            const festividad: TipoFestividad = tipoFestividad === 'festivoN' ? 'nacional' :
                tipoFestividad === 'festivoP' ? 'provincial' : 'regional';
            return { dia, nameFestividad, festividad };
        });

        mapFestivos.set(mes as Mes, listaFestivos);
    }

    return Object.fromEntries(mapFestivos.entries());
}

export async function getProvincias(): Promise<FindProvinciasResponse> {
    const response = await fetch("https://www.calendarioslaborales.com/", {
        method: "GET",
    });

    const html = await response.text();
    const doc = new DOMParser(domParserArgs).parseFromString(html);

    const elements = xpath.select(
        "/html/body/div/div/div[1]/div/div[1]/div/form/div[1]/select/option[position() > 1]",
        doc,
    ) as Array<Element>;

    const provincias = elements.map((e) => {
        return {
            id: e.getAttribute("value")!,
            label: e.firstChild!.nodeValue!,
        };
    });

    return provincias;
}

export async function getYears() {
    const response = await fetch("https://www.calendarioslaborales.com/");
    const html = await response.text();
    const doc = new DOMParser(domParserArgs).parseFromString(html);

    const groupsElements = xpath.select(`/html/body/div/div/div[1]/div/div[1]/div/form/div[2]/select/optgroup`, doc) as Element[];

    const yearsData = [];
    for (const group of groupsElements) {
        const groupName = group.getAttribute('label')!;
        const yearsGroup = Array.from(group.childNodes).filter((node) => node.nodeName === 'option').map((li) => {
            const year = Number.parseInt((li as Element).getAttribute('value')!);
            return { year, groupName: decodeHTMLEntities(groupName) }
        });
        yearsData.push(...yearsGroup);
    }

    return yearsData;
}
