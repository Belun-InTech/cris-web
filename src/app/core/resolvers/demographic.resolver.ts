import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { DemographicService } from "../services";
import { inject } from "@angular/core";


/**
 * Resolves the eventu by id.
 *
 * @param route - The route snapshot.
 *
 * @returns A promise of the eventu.
 */
export const getDemographicByIdResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => 
    inject(DemographicService).getByIdNumberAndType(route.paramMap.get('id')!, route.queryParamMap.get('type'));


/**
 * Resolves a page of demographic data.
 *
 * @returns A promise that resolves to an HttpResponse of demographic objects.
 */
export const getPageDemographicResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const demographicService = inject(DemographicService);
    // Extract page & size from query parameters (default: page=1, size=10)
    const page = route.queryParamMap.get('page') ? Number(route.queryParamMap.get('page')) : 0;
    const size = route.queryParamMap.get('size') ? Number(route.queryParamMap.get('size')) : 50;
    return demographicService.getPagination(page, size);
}
