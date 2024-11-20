import { PostuAdministrativu } from "./postu";

export interface Munisipiu {
    id: number;
    naran: string;
    listaPostuAdministrativu?: PostuAdministrativu[];
}