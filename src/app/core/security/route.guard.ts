import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';

export const authenticationCanActivate: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const location = inject(Location);
    const admin = authService.currentUserValue;

    if (admin) {
        return true;
    } else {
        location.back();
        return false;
    }
}


export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const user = authService.currentUserValue;
    if (user) {
        router.navigate(['/admin/dashboard']).then();
        return of(false);
    } else {
        return of(true);
    }
}