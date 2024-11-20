import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse, HttpResponseList, Partidu } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PartiduService {
  private apiUrl = `${environment.apiUrl}/partidus`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: Partidu): Observable<HttpResponse<Partidu>> {
    return this.http.post<HttpResponse<Partidu>>(this.apiUrl, { data: form });
  }

  updateById(id: number, form: Partidu): Observable<HttpResponse<Partidu>> {
    return this.http.put<HttpResponse<Partidu>>(`${this.apiUrl}/${id}`, { data: form });
  }

  getPagination(page?: number, size?: number): Observable<HttpResponseList<Partidu>> {
    let params = new HttpParams()
      .append('sort', 'createdAt:desc');
    if (page && size) {
      params.append('page', page)
      params.append('size', size);
      return this.http.get<HttpResponseList<Partidu>>(this.apiUrl, { params });
    } else {
      return this.http.get<HttpResponseList<Partidu>>(this.apiUrl, { params });
    }
  }

  getBySearchQuery(query: string): Observable<HttpResponseList<Partidu>> {
    const params = new HttpParams()
      .append('filters[$or][0][naran][$contains]', query)
      .append('filters[$or][1][sigla][$contains]', query)
      .append('sort', 'updatedAt:desc')
    return this.http.get<HttpResponseList<Partidu>>(`${this.apiUrl}`, { params });
  }

  deleteById(id: number): Observable<HttpResponse<Partidu>> {
    return this.http.delete<HttpResponse<Partidu>>(`${this.apiUrl}/${id}`);
  }
}
