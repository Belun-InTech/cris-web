import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { DataMasterService } from "../services";


export const getFinancialInstitutionListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListFinancialInstitution();
}

export const getFaqListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListFaq();
}

export const getSectorListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListSector();
}

export const getTypeCollateralListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListTypeCollateral();
}

export const getCreditClassificationListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListCreditClassification();
}

export const getCityResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListCity();
}

export const getMaritalStatusResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListMaritalStatus();
}

export const getMannerOfPaymentResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListMannerOfPayment();
}