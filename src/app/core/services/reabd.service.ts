import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse, HttpResponseList, Reabd } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReabdService {
  private apiLokalUrl = `${environment.apiUrl}/resenseamentus`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: any): Observable<HttpResponse<Reabd>> {
    return this.http.post<HttpResponse<Reabd>>(`${this.apiLokalUrl}`, { data: form });
  }

  updateById(id: number, form: Reabd): Observable<HttpResponse<Reabd>> {
    return this.http.put<HttpResponse<Reabd>>(`${this.apiLokalUrl}/${id}`, { data: form });
  }

  getPagination(page: number, size: number): Observable<HttpResponseList<Reabd>> {
    const params = new HttpParams()
      .append('populate[postuAdministrativu][populate][munisipiu]', '*')
      .append('pagination[page]', page)
      .append('pagination[pageSize]', size)
      .append('sort', 'updatedAt:desc')

    return this.http.get<HttpResponseList<Reabd>>(`${this.apiLokalUrl}`, { params });
  }

  getById(id: number): Observable<HttpResponse<Reabd>> {
    const params = new HttpParams()
      .append('populate[postuAdministrativu][populate][munisipiu]', '*')
    return this.http.get<HttpResponse<Reabd>>(`${this.apiLokalUrl}/${id}`, { params });
  }

  getBySearchQuery(query: string): Observable<HttpResponseList<Reabd>> {
    const params = new HttpParams()
      .append('filters[$or][0][supervizor][$contains]', query)
      .append('filters[$or][1][postuAdministrativu][naran][$contains]', query)
      .append('filters[$or][2][postuAdministrativu][munisipiu][naran][$contains]', query)
      .append('populate[postuAdministrativu][populate][munisipiu]', '*')
      .append('sort', 'updatedAt:desc')
    return this.http.get<HttpResponseList<Reabd>>(`${this.apiLokalUrl}`, { params });
  }

  deleteById(id: number): Observable<HttpResponse<Reabd>> {
    return this.http.delete<HttpResponse<Reabd>>(`${this.apiLokalUrl}/${id}`);
  }

  filterByRangeDates(startDate: Date, endDate: Date): Observable<HttpResponseList<Reabd>> {

    // Set DateTime to 23:59:59
    // const newEndDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    endDate.setUTCHours(23, 59, 59, 999);

    // console.log('New Start Date Format: ', startDate);

    // 2024-08-31T14:59:59.000Z
    // console.log('New End Date Format: ', `${endDate.getUTCFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T14:59:59.999Z`);

    const params = new HttpParams()
      .append('filters[$or][0][createdAt][$between]', startDate.toISOString())
      .append('filters[$or][0][createdAt][$between]', `${endDate.getUTCFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T14:59:59.999Z`)
      .append('populate[postuAdministrativu][populate][munisipiu]', '*')


    return this.http.get<HttpResponseList<Reabd>>(`${this.apiLokalUrl}`, { params });
  }

  getMunisipiuCountByRangeYear(startDate: Date, endDate: Date): Observable<any[]> {

    // Set DateTime to 23:59:59
    endDate.setUTCHours(23, 59, 59, 999);

    const params = new HttpParams()
      .append('startDate', startDate.toISOString())
      .append('endDate', `${endDate.getUTCFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T14:59:59.999Z`)

    return this.http.get<any[]>(`${this.apiLokalUrl}/munisipiu`, { params });
  }

  getMonthlyCountByRangeYear(startDate: Date, endDate: Date): Observable<any[]> {

    // Set DateTime to 23:59:59
    endDate.setUTCHours(23, 59, 59, 999);

    const params = new HttpParams()
      .append('startDate', startDate.toISOString())
      .append('endDate', `${endDate.getUTCFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T14:59:59.999Z`)

    return this.http.get<any[]>(`${this.apiLokalUrl}/monthly`, { params });
  }



  getReportsMonthlyByYear(startDate: Date, endDate: Date): Observable<any[]> {
    // Set DateTime to 23:59:59
    endDate.setUTCHours(23, 59, 59, 999);

    const params = new HttpParams()
      .append('startDate', startDate.toISOString())
      .append('endDate', `${endDate.getUTCFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T14:59:59.999Z`)
    return this.http.get<any[]>(`${this.apiLokalUrl}/reports/monthly`, { params });
  }
}

