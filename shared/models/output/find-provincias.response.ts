import { Input, object, string } from "valibot";

const ProvinciaSchema = object({
    id: string(),
    label: string()
});

export type Provincia = Input<typeof ProvinciaSchema>;
export type FindProvinciasResponse = Array<Provincia>;