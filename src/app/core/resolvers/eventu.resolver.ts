import { inject } from "@angular/core";
import { Eventu, HttpResponse, HttpResponseList } from "../models";
import { EventuService } from "../services/eventu.service";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

export const getAllEventuResolver: ResolveFn<HttpResponseList<Eventu>> = () => {
    const service = inject(EventuService);
    return service.getPagination(0, 50);
}

export const getEventuByIdResolver: ResolveFn<HttpResponse<Eventu>> = (route: ActivatedRouteSnapshot) => {
    const id = route.paramMap.get('id');
    const service = inject(EventuService);
    return service.getById(+id);
}