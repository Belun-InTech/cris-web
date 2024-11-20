import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { HttpResponseList, Munisipiu } from "../models";
import { LocalService } from "../services";

export const getAllMunicipalitiesResolver: ResolveFn<HttpResponseList<Munisipiu>> = () => {
    const service = inject(LocalService);
    return service.getMunisipiuPagination();
}
