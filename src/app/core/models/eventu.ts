import { Koligasaun } from "./koligasaun";
import { Partidu } from "./partidu";

export class Eventu {
    id: number;
    titulu: string;
    dataHahu: Date;
    dataRemata: Date;
    listaPartidu: Partidu[];
    listaKoligasaun: Koligasaun[];
}