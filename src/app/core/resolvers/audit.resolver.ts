import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
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

export const getLoginActivities: ResolveFn<any> = () => {
    const authService = inject(AuthenticationService);
    const auditService = inject(AuditService);
    const role = authService.currentRole;
    const username = authService.currentUserValue.username;

    if (role === Role.admin) {
        return auditService.getLoginActivities();
    } else {
        return auditService.getLoginActivitiesByUsername(username)
    }

}