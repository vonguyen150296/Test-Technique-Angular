import { Product } from "./product";
import { Groupe } from "./groupe";

export interface Responses {
    hits: Product[];
    total: Number;
    groups: Groupe[];
    subgroups: Groupe[];
}