import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { HttpResponseList, User } from "../models";
import { UtilizadorService } from "../services";

export const getAllUtilizadorResolver: ResolveFn<User[]> = () => {
    const service = inject(UtilizadorService);
    return service.getPagination();
}