import { Input, picklist } from "valibot";

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


export const TipoFestividadSchema = picklist(['regional', 'provincial', 'nacional']);

export type TipoFestividad = Input<typeof TipoFestividadSchema>;