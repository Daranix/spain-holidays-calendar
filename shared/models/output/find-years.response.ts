import { Input, number, object, string } from "valibot";

export const YearSchema = object({
    year: number(),
    groupName: string()
})

export type Year = Input<typeof YearSchema>;

export type FindYearResponse = Array<Year>;