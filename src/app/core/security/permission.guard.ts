import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/enum';

/**
 * Function-style guard to enforce permission on routes.
 * Add `data: { requiredPermission: 'MENU_SEARCH_ACCESS' }` to route definitions.
 */
export const canActivateByPermission: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthenticationService);
    const location = inject(Location);

    const required = route.data?.['requiredPermission'] as string | string[] | undefined;

    // Check only if the User is a Client
    if (authService.currentRole.name === Role.client) {
        const allowed =
            !required
                ? true
                : Array.isArray(required)
                    ? authService.hasAnyPermission(required)
                    : authService.hasPermission(required);

        if (allowed) return true;
        location.back();
        return false;
    }

    // Non-clients are always allowed
    return true;
}