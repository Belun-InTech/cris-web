import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { DataMasterService } from "../services";


export const getBankListResolver: ResolveFn<any> = () => {
    const service = inject(DataMasterService);
    return service.getListBanks();
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