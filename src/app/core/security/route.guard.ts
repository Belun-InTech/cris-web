import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';

export const authenticationCanActivate: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const location = inject(Location);
    const admin = authService.currentUserValue;
    console.log(admin);
    
    if (admin) {
        return true;
    } else {
        location.back();
        return false;
    }
}

export const canActivateByRole: CanActivateChildFn = (
    childRoute: ActivatedRouteSnapshot
) => {
    const authService = inject(AuthenticationService);
    const location = inject(Location);
    const user = authService.currentUserValue;

    const allowedRoles: any[] = childRoute.data['role'];

    if (!allowedRoles || allowedRoles.length === 0) {
        // role not authorised so redirect to home page
        location.back();
        return of(false);
    } else if (allowedRoles.includes(user.role)) {
        return of(true);
    } else {
        location.back();
        return of(false);
    }
}


/**
 * Guard function to check if a user is already authenticated.
 *
 * If the user is authenticated, navigates to the admin dashboard and returns
 * an observable of false, preventing access to the current route. If not
 * authenticated, returns an observable of true, allowing access.
 *
 * @returns An observable of a boolean indicating whether the navigation should
 *          proceed (true if not authenticated, false if authenticated).
 */

export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const user = authService.currentUserValue;
    if (user) {
        router.navigate(['/dashboard']).then();
        return of(false);
    } else {
        return of(true);
    }
}


/**
 * Guard function to validate and sanitize query parameters for pagination.
 *
 * @param route - The active route snapshot containing the query parameters.
 * @param state - The router state snapshot.
 * @returns A boolean indicating whether the query parameters are valid. If invalid,
 *          navigates to the current URL with sanitized query parameters and returns false.
 */

export const canActivateQueryParams: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);

    const page = route.queryParamMap.get('page');
    const size = route.queryParamMap.get('size');

    const MAX_SIZE = 300;
    const isValidNumber = (value: string | null): boolean => /^\d+$/.test(value ?? '');

    const toInteger = (value: string | null, defaultValue: number): number =>
        isValidNumber(value) ? Math.min(parseInt(value!, 10), MAX_SIZE) : defaultValue;

    const safePage = toInteger(page, 0);
    const safeSize = toInteger(size, 50);
    if (safePage.toString() !== page || safeSize.toString() !== size) {
        router.navigate([state.url], {
            queryParams: { page: page ?? 0, size: size ?? 50 },
            queryParamsHandling: 'merge' // Keeps other existing query params
        });
        return false;
    }

    return true;
};