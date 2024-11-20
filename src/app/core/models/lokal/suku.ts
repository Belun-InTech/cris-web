import { Aldeia } from "./aldeia";
import { PostuAdministrativu } from "./postu";

export interface Suku {
    id: number;
    naran: string;
    postuAdministrativu: PostuAdministrativu;
    listaAldeia?: Aldeia[];
}