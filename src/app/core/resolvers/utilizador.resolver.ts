import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { UserService } from "../services";

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