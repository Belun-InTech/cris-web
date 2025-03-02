import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Saves a user to the server.
   *
   * @param form The user object to be sent to the server.
   * @returns An observable of the server response.
   */
  save(form: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, form);
  }


  /**
   * Updates a user on the server by their username.
   *
   * This method sends a PUT request to the server with the updated user data.
   *
   * @param username The username of the user to update.
   * @param form The updated user data to be sent to the server.
   * @returns An observable of the server response.
   */

  updateByUsername(username: string, form: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${username}`, form);
  }

  /**
   * Makes a GET request to the users endpoint to retrieve a user by their username.
   *
   * @param username The username of the user to retrieve.
   * @returns An observable of the server response.
   */
  getByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}`).pipe(take(1));
  }

  /**
   * Makes a GET request to the users endpoint with optional pagination parameters.
   *
   * @param page The page number to retrieve.
   * @param size The number of items per page.
   * @returns The response from the server.
   */
  getPagination(page?: number, size?: number): Observable<any> {
    let params = new HttpParams();
    if (page && size) {
      params.append('page', page)
      params.append('size', size);
      return this.http.get<any>(this.apiUrl, { params }).pipe(take(1));
    } else {
      return this.http.get<any>(this.apiUrl, { params }).pipe(take(1));
    }
  }

  activate(token: string, form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activate?token=${token}`, form);
  }

  /**
   * Makes a GET request to the users endpoint with the /ldap/{username} path
   * to retrieve a user from LDAP by their username.
   *
   * @param username The username of the user to retrieve from LDAP.
   * @returns An observable of the server response.
   */
  getByLdapByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ldap/${username}`).pipe(take(1));
  }
}
