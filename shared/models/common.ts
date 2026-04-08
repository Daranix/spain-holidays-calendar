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


export const TipoFestividadSchema = picklist(['autonomico', 'nacional', 'local']);

export type TipoFestividad = Input<typeof TipoFestividadSchema>;

export const HOLIDAY_MAP = {
    'national': { val: 'nacional', label: 'Festivo Nacional' },
    'regional': { val: 'autonomico', label: 'Festivo Autonómico' },
    'local': { val: 'local', label: 'Festivo Local' }
} as const;

export const HOLIDAY_TYPES_CONFIG = {
    nacional: HOLIDAY_MAP['national'],
    autonomico: HOLIDAY_MAP['regional'],
    local: HOLIDAY_MAP['local']
} as const;