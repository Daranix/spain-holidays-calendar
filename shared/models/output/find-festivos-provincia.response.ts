import { number, object, record, string, Input, array, picklist } from "valibot";
import { TipoFestividadSchema, meses } from "../common";


const DiaFestivoSchema = object({
    dia: number(),
    nameFestividad: string(),
    festividad: TipoFestividadSchema
});

const FindFestivosProvinciaResponseSchema = record(picklist(meses), array(DiaFestivoSchema));

export type DiaFestivo = Input<typeof DiaFestivoSchema>;
export type FindFestivosProvinciaResponse = Input<typeof FindFestivosProvinciaResponseSchema>;
