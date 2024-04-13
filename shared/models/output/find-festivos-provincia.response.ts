import { number, object, record, string, Input, array } from "valibot";
import { TipoFestividadSchema } from "../common";


const DiaFestivoSchema = object({
    dia: number(),
    nameFestividad: string(),
    festividad: TipoFestividadSchema
});

const FindFestivosProvinciaResponseSchema = record(string(), array(DiaFestivoSchema));

export type DiaFestivo = Input<typeof DiaFestivoSchema>;
export type FindFestivosProvinciaResponse = Input<typeof FindFestivosProvinciaResponseSchema>;
