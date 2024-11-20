import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { HttpResponse, HttpResponseList, TipuKampana } from "../models";
import { KampanaEleitoral } from "../models/kampana-eleitoral";
import { KampanaEleitoralService } from "../services/kampana-eleitoral.service";

export const getAllKampanaEleitoralResolver: ResolveFn<HttpResponseList<KampanaEleitoral>> = () => {
    const service = inject(KampanaEleitoralService);
    return service.getPagination(0, 50);
}

export const getKampanaEleitoralByIdResolver: ResolveFn<HttpResponse<KampanaEleitoral>> = (route: ActivatedRouteSnapshot) => {
    const id = route.paramMap.get('id');
    const service = inject(KampanaEleitoralService);
    return service.getById(+id);
}

export const getAllTipuKampanaResolver: ResolveFn<HttpResponseList<TipuKampana>> = () => {
    const service = inject(KampanaEleitoralService);
    return service.getAllTipuKamapana();
}
