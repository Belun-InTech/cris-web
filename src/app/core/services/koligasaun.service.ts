import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse, HttpResponseList, Koligasaun } from '../models';

@Injectable({
  providedIn: 'root'
})
export class KoligasaunService {
  private apiUrl = `${environment.apiUrl}/koligasauns`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: Koligasaun): Observable<HttpResponse<Koligasaun>> {
    return this.http.post<HttpResponse<Koligasaun>>(this.apiUrl, { data: form });
  }

  updateById(id: number, form: Koligasaun): Observable<HttpResponse<Koligasaun>> {
    return this.http.put<HttpResponse<Koligasaun>>(`${this.apiUrl}/${id}`, { data: form });
  }

  getPagination(page?: number, size?: number): Observable<HttpResponseList<Koligasaun>> {
    let params = new HttpParams()
      .append('populate[listaPartidu]', '*')
      .append('sort', 'createdAt:desc');
    if (page && size) {
      const params = new HttpParams()
        .append('page', page)
        .append('size', size);
      return this.http.get<HttpResponseList<Koligasaun>>(this.apiUrl, { params });
    } else {
      return this.http.get<HttpResponseList<Koligasaun>>(this.apiUrl, { params });
    }
  }

  getBySearchQuery(query: string): Observable<HttpResponseList<Koligasaun>> {
    const params = new HttpParams()
      .append('filters[$or][0][naran][$contains]', query)
      .append('filters[$or][1][sigla][$contains]', query)
      .append('populate[listaPartidu]', '*')
      .append('sort', 'updatedAt:desc')
    return this.http.get<HttpResponseList<Koligasaun>>(`${this.apiUrl}`, { params });
  }

  deleteById(id: number): Observable<HttpResponse<Koligasaun>> {
    return this.http.delete<HttpResponse<Koligasaun>>(`${this.apiUrl}/${id}`);
  }
}
