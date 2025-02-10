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
   * Saves a list of demographics to the server.
   *
   * @param formList The array of demographic objects to be sent to the server.
   * @returns An observable of the server response.
   */
  saveAll(formList: any[]): Observable<any> {
    const form = {
      demographics: formList,
      demographic: null
    }
    return this.http.post<any>(this.apiUrl, form).pipe(take(1));
  }

  /**
   * Updates a demographic by ID.
   *
   * @param id The ID of the demographic to update.
   * @param formData The demographic object to be sent to the server.
   * @returns An observable of the server response.
   */
  updateById(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(take(1));
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

  /**
   * Checks for duplicate demographics in the database.
   *
   * @param data An array of demographic objects to be checked for duplicates.
   * @returns An observable of the server response, which is an array of demographic
   * objects that are duplicates. If no duplicates are found, the array is empty.
   */
  checkDuplicates(data: any[]): Observable<any[]> {
    return this.http.post<any>(`${this.apiUrl}/duplicate-check`, data).pipe(take(1));
  }
}
