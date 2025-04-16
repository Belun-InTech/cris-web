import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, Observable, reduce, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Credit } from '../models/data';
import { normalizeId } from '../utils/global-types';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  protected apiUrl = `${environment.apiUrl}/credits`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: any): Observable<Credit> {
    form = {
      credits: [],
      credit: form
    }
    return this.http.post<Credit>(this.apiUrl, form).pipe(take(1));
  }

  saveAll(formList: any[]): Observable<Credit[]> {
    const form = {
      credits: formList,
      credit: null
    }
    return this.http.post<Credit[]>(this.apiUrl, form).pipe(take(1));
  }

  getPagination(page = 0, size = 50): Observable<any> {
    let params = new HttpParams();
    params.append('page', page)
    params.append('size', size);
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(take(1));
  }

  getById(id: number, idNumber: string): Observable<Credit> {
    let params = new HttpParams();
    params.append('idNumber', normalizeId(idNumber));
    return this.http.get<Credit>(`${this.apiUrl}/${id}?idNumber=${idNumber}`).pipe(take(1));
  }

  updateById(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(take(1));
  }

  checkMissings(data: any[]): Observable<Credit[]> {
    return this.http.post<Credit[]>(`${this.apiUrl}/missing-check`, data).pipe(take(1));
  }

  getAll(size: number = 50, initialPage: number = 0): Observable<any[]> {
    let currentPage = initialPage;

    return this.getPagination(currentPage, size).pipe(
      expand(response => {
        // Assuming the response has a property `content` (an array of items)
        // If the current page returns as many items as the page size, we assume there is another page.
        if (response.content && response.content.length === size) {
          currentPage++;
          return this.getPagination(currentPage, size);
        } else {
          return EMPTY;
        }
      }),
      // Accumulate all the responses into a single array.
      reduce((allItems, response) => {
        // Concatenate the current page's items with all previously retrieved items.
        return allItems.concat(response.content);
      }, [])
    );
  }

  /**
   * Retrieves a list of credit records that match the given search query.
   *
   * This method makes a GET request to the server's /search endpoint with the
   * query parameter set to the given query. The server will return a list of
   * credit records that match the query.
   *
   * @param query The query string to search for.
   * @returns An observable of the server response.
   */
  filterByQuery(query: any): Observable<any> {
    let params = new HttpParams()
      .append('query', query)
    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(take(1));
  }
}
