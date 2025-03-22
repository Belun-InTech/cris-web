import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, Observable, reduce, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { normalizeId } from '../utils/global-types';

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
  getByIdNumberAndType(idNumber: string, type: string): Observable<any> {
    const params = new HttpParams()
      .append('type', type.toUpperCase());
    return this.http.get<any>(`${this.apiUrl}/${normalizeId(idNumber)}`, { params }).pipe(take(1));
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
   * Retrieves a list of demographic records that match the given search query.
   *
   * This method makes a GET request to the server's /search endpoint with the
   * query parameter set to the given query. The server will return a list of
   * demographic records that match the query.
   *
   * @param query The query string to search for.
   * @returns An observable of the server response.
   */
  filterByQuery(query: any): Observable<any> {
    let params = new HttpParams()
      .append('query', query)
    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(take(1));
  }

  /**
   * Makes a GET request to the demographics endpoint with query parameters
   * representing the current filters.
   *
   * The server will return a list of demographic records that match the current
   * filters.
   *
   * @param filters An object of filter keys to values, where each key is the name
   * of a demographic field and the value is an array of values to filter by.
   * @returns An observable of the server response.
   */
  filterByParams(filters: any): Observable<any> {
    let params = new HttpParams()
      .append('fullName', filters.fullName[0].value)
      .append('idNumber', normalizeId(filters.idNumber[0].value));
    return this.http.get<any>(`${this.apiUrl}/filter`, { params }).pipe(take(1));
  }


  /**
   * Retrieves all demographic records from the server by repeatedly calling the
   * {@link getPagination} method until no more pages are available.
   *
   * The observable returned by this method will emit a single array containing all
   * the demographic records retrieved from the server.
   *
   * @param size The number of demographic records per page.
   * @param initialPage The page number to start retrieving records from.
   * @returns An observable of an array of demographic records.
   */
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
