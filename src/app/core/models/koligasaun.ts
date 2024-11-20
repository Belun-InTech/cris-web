import { Partidu } from "./partidu";

export interface Koligasaun {
    id: number;
    naran: string;
    sigla: string;
    listaPartidu: Partidu[];
}