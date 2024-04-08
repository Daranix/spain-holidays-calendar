export const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    'julio',
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
] as const;

export type Mes = (typeof meses)[number];

export interface DiaFestivo {
    dia: number,
    nameFestividad: string;
    festividad: TipoFestividad;
}

export type TipoFestividad = 'regional' | 'provincial' | 'nacional';