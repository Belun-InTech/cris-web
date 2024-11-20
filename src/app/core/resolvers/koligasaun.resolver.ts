import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { HttpResponseList, Koligasaun } from "../models";
import { KoligasaunService } from "../services/koligasaun.service";

export const getAllKoligasaunResolver: ResolveFn<HttpResponseList<Koligasaun>> = () => {
    const service = inject(KoligasaunService);
    return service.getPagination();
}