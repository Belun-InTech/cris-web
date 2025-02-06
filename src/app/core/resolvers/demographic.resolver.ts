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
export const getDemographicByIdResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => inject(DemographicService).getById(+route.paramMap.get('id')!);

/**
 * Resolves a page of demographic data.
 *
 * @returns A promise that resolves to an HttpResponse of demographic objects.
 */
export const getPageDemographicResolver: ResolveFn<any> = () => inject(DemographicService).getPagination();
