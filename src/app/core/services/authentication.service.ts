import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  protected apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Logs in a user by sending a POST request to the server with the given
   * username and password. The response will contain the authenticated user
   * data as well as a JSON Web Token (JWT) which is stored in local storage.
   * If the authentication fails, an error is thrown.
   *
   * @param {User} form - The user data to be sent to the server.
   * @returns {Observable<HttpResponse<User>>} - An observable containing the
   * authenticated user data and the JWT.
   */
  authServer(form: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/authenticate`, form)
      .pipe(
        map(response => {
          this.setSession(response);
          return response;
        })
      );
  }

  /**
   * Logs out the currently authenticated user by sending a POST request to the server
   * with the existing authentication token in the headers. If no token is found, an
   * error is thrown. Returns an observable that emits a confirmation string upon success.
   *
   * @returns {Observable<string>} - An observable containing the logout confirmation message.
   * @throws {Error} - If no authentication token is found in local storage.
   */

  logout(): Observable<any> {
    localStorage.clear();
    return this.http.post<any>(`${this.apiUrl}/logout`, this.getToken);
  }

  /**
   * Stores the authentication result in local storage as a JSON
   * string for the 'user' key and the JWT as a string for the
   * 'id_token' key. Clears all existing local storage items
   * before setting the new values.
   * 
   * @param {any} authResult - The authentication result returned by the server.
   */
  private setSession(authResult: any): void {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(authResult));
    localStorage.setItem('token', authResult.token);
  }

  get currentUserValue(): any {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  get getToken(): any {
    return localStorage.getItem('token');
  }

}
