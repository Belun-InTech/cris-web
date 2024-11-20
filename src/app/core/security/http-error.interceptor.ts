import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthenticationService,
        private router: Router,
    ) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken;

        if (token !== null) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';

                    if (error.status === 401 || error.status === 403) {
                        this.router.navigate(['/']).then(() => this.authService.logout());
                    }
                    if (!(error.error instanceof ProgressEvent)) {
                        // client-side error
                        // errorMessage = `Error: ${error.error.message}`;
                        errorMessage = error.error?.message
                    } else {
                        // server-side error
                        // errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        errorMessage = `Iha erru konexaun, favor tenta dala ida tan!`
                    }
                    return throwError(() => errorMessage);
                })
            );
    }
}