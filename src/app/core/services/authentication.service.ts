import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '../models';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  protected apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  private setSession(authResult: any): void {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('id_token', authResult.jwt);
  }

  setLocalSession(username): void {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(username));
    // localStorage.setItem('id_token', authResult.jwt);
  }

  authServer(form: User): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(`${this.apiUrl}/auth/local`, form)
      .pipe(
        map(response => {
          this.setSession(response);
          return response;
        })
      );
  }

  logout(): void {
    localStorage.clear();
  }

  get currentUserValue(): any {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  get getToken(): any {
    return localStorage.getItem('id_token');
  }

}
