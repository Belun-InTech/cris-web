import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemographicService {
  protected apiUrl = `${environment.apiUrl}/demographics`;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Saves a demographic to the server.
   *
   * @param form The demographic object to be sent to the server.
   * @returns An observable of the server response.
   */
  save(form: any): Observable<any> {
    form = {
      demographics: [],
      demographic: form
    }
    return this.http.post<any>(this.apiUrl, form).pipe(take(1));
  }

  /**
   * Retrieves a demographic by ID.
   *
   * @param id The ID of the demographic to retrieve.
   * @returns An observable of the server response.
   */
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(take(1));
  }

  /**
   * Makes a GET request to the demographics endpoint with optional pagination
   * parameters.
   *
   * @param page The page number to retrieve.
   * @param size The number of items per page.
   * @returns The response from the server.
   */
  getPagination(page = 0, size = 50): Observable<any> {
    let params = new HttpParams();
      params.append('page', page)
      params.append('size', size);
      return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(take(1));
  }
}
