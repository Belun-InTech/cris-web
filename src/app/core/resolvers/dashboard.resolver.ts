import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Dashboard } from "../models/data";
import { DashboardService } from "../services/dashboard.service";


export const getDashboardDataResolver: ResolveFn<Dashboard> = (route: ActivatedRouteSnapshot) =>
    inject(DashboardService).getDashboardData();