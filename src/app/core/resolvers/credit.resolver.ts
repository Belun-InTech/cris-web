import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { CreditService } from "../services/credit.service";


export const getPageCreditResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const creditService = inject(CreditService);
    // Extract page & size from query parameters (default: page=1, size=10)
    const page = route.queryParamMap.get('page') ? Number(route.queryParamMap.get('page')) : 0;
    const size = route.queryParamMap.get('size') ? Number(route.queryParamMap.get('size')) : 50;
    return creditService.getPagination(page, size);
}

export const getCreditByIdResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => inject(CreditService).getById(+route.paramMap.get('id'), route.queryParamMap.get('idNumber'));