import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Role } from "../models/enum";
import { AuditService, AuthenticationService } from "../services";



export const getAllActivities: ResolveFn<any> = () => {
    const authService = inject(AuthenticationService);
    const auditService = inject(AuditService);
    const role = authService.currentRole;
    const username = authService.currentUserValue.username;

    if (role === Role.admin) {
        return auditService.getAllActions();
    } else {
        return auditService.getActionsByUsername(username)
    }
}

export const getLoginActivities: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthenticationService);
    const auditService = inject(AuditService);
    const role = authService.currentRole;
    const username = authService.currentUserValue.username;

    const startDateTime = route.queryParamMap.get('sdt') ? new Date(route.queryParamMap.get('sdt')) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDateTime = route.queryParamMap.get('edt') ? new Date(route.queryParamMap.get('edt')) : new Date();

    const page = route.queryParamMap.get('page') ? Number(route.queryParamMap.get('page')) : 0;
    const size = route.queryParamMap.get('size') ? Number(route.queryParamMap.get('size')) : 50;

    if (role === Role.admin) {
        return auditService.getLoginActivities(startDateTime, endDateTime, page, size);
    } else {
        return auditService.getLoginActivitiesByUsername(username, startDateTime, endDateTime, page, size)
    }

}