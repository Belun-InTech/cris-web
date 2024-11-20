import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { HttpResponse, HttpResponseList, Reabd } from "../models";
import { KampanaEleitoralService, ReabdService } from "../services";
import { KampanaEleitoral } from "../models/kampana-eleitoral";

export const getAllReabdResolver: ResolveFn<HttpResponseList<Reabd>> = () => {
    const service = inject(ReabdService);
    return service.getPagination(0, 50);
}

export const getReabdByIdResolver: ResolveFn<HttpResponse<Reabd>> = (route: ActivatedRouteSnapshot) => {
    const id = route.paramMap.get('id');
    const service = inject(ReabdService);
    return service.getById(+id);
}
