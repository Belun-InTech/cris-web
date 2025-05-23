import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services";
import { EMPTY, of } from "rxjs";

/**
 * Resolves a page of users.
 *
 * @returns A promise that resolves to an HttpResponse of User objects.
 */
export const getPageUserResolver: ResolveFn<any> = () => {
    const service = inject(UserService);
    return service.getPagination();
}

/**
 * Resolves the user by username.
 *
 * @param route - The route snapshot.
 *
 * @returns A promise of the user.
 */
export const getUserByUsernameResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const username = route.paramMap.get('username');
    const service = inject(UserService);
    return service.getByUsername(username);
}

export const getTokenActivationResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const token = route.queryParamMap.get('t');

    // Basic JWT regex: header.payload.signature
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

    if (token && jwtRegex.test(token)) {
        return of(token);
    } else {
        // If token is invalid or missing, navigate to the index route
        router.navigate(['/']);
        return EMPTY;
    }
}