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
  private userKey = 'user';
  private jwtKey = 'token';
  private permsCache: Set<string> | null = null; // Cache decoded permissions to avoid repeated parsing

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
    return this.http.post<User>(`${this.apiUrl}/authenticate`, form);
  }

  /**
   * Validates the provided OTP for the given username by sending a POST request
   * to the server. If the OTP is valid, the user's session is set and the user
   * data is returned.
   *
   * @param {string} username - The username of the user to validate the OTP for.
   * @param {string} otp - The one-time password to be validated.
   * @returns {Observable<User>} - An observable containing the authenticated user data.
   */
  validateOTP(username: string, otp: string): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/otp/${otp}`, { username })
      .pipe(
        map(response => {
          this.setSession(response);
          return response;
        })
      );
  }

  regenerateOTP(username: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/otp/${username}`, { username });
  }

  sendForgotPasswordEmail(email: string): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/forgot-password?email=${email}`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/reset-password`, data);
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
    const token = this.getToken;
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.jwtKey);
    this.permsCache = null; // Clear cached permissions on logout
    return this.http.post<any>(`${this.apiUrl}/logout`, token);
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
    localStorage.setItem(this.userKey, JSON.stringify(authResult));
    localStorage.setItem(this.jwtKey, authResult.token);
  }

  hasPermission(permission: string): boolean {
    if (!permission) return true;
    const perms = this.getPermissions();
    return perms.has(permission);
  }

  hasAnyPermission(required: string[]): boolean {
    if (!required || required.length === 0) return true;
    const perms = this.getPermissions();
    return required.some(p => perms.has(p));
  }

  private getPermissions(): Set<string> {
    if (this.permsCache) return this.permsCache;
    const token = this.getToken;
    const payload = this.decodeJwt(token);
    const perms: string[] = Array.isArray(payload?.perms) ? payload.perms : [];
    console.log(perms);
    
    this.permsCache = new Set(perms);
    return this.permsCache;
  }

  private decodeJwt(token: string | null): any {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(payload)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  get currentUserValue(): any {
    const user = localStorage.getItem(this.userKey);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  get currentRole(): any {
    const user = localStorage.getItem(this.userKey);
    if (user) {
      return JSON.parse(user).role;
    }
    return null;
  }

  get getToken(): any {
    return localStorage.getItem(this.jwtKey);
  }

}
