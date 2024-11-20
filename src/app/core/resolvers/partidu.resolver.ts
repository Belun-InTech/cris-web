import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { HttpResponseList, Partidu } from "../models";
import { PartiduService } from "../services/partidu.service";

export const getAllPartiduResolver: ResolveFn<HttpResponseList<Partidu>> = () => {
    const service = inject(PartiduService);
    return service.getPagination();
}

// export const getEventuByIdResolver: ResolveFn<HttpResponse<Eventu>> = (route: ActivatedRouteSnapshot) => {
//     const id = route.paramMap.get('id');
//     const service = inject(EventuService);
//     return service.getById(+id);
// }