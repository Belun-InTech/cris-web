import { Munisipiu } from "./munisipiu";
import { Suku } from "./suku";

export interface PostuAdministrativu {
    id: number;
    naran: string;
    munisipiu: Munisipiu;
    listaSuku?: Suku[];
}