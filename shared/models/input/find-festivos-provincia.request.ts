import { Input, number, object, string } from "valibot";

export const FindFestivosProvinciaRequestSchema = object({
    provincia: string(),
    year: number()
});

export type FindFestivosProvinciaRequest = Input<typeof FindFestivosProvinciaRequestSchema>;