import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Eventu, HttpResponse, HttpResponseList } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventuService {
  private apiUrl = `${environment.apiUrl}/eventus`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: Eventu): Observable<HttpResponse<Eventu>> {
    return this.http.post<HttpResponse<Eventu>>(this.apiUrl, { data: form });
  }

  updateById(id: number, form: Eventu): Observable<HttpResponse<Eventu>> {
    return this.http.put<HttpResponse<Eventu>>(`${this.apiUrl}/${id}`, { data: form });
  }

  getPagination(page?: number, size?: number): Observable<HttpResponseList<Eventu>> {
    if (page && size) {
      const params = new HttpParams()
        .append('populate[listaKoligasaun]', '*')
        .append('populate[listaPartidu]', '*')
        .append('pagination[page]', page)
        .append('pagination[pageSize]', size)
        .append('sort', 'createdAt:desc')
      return this.http.get<HttpResponseList<Eventu>>(`${this.apiUrl}`, { params });
    } else {
      const params = new HttpParams()
        .append('populate[listaKoligasaun]', '*')
        .append('populate[listaPartidu]', '*')
        .append('sort', 'createdAt:desc')
      return this.http.get<HttpResponseList<Eventu>>(`${this.apiUrl}`, { params });
    }

  }

  getById(id: number): Observable<HttpResponse<Eventu>> {
    const params = new HttpParams()
      .append('populate[listaKoligasaun]', '*')
      .append('populate[listaPartidu]', '*');
    return this.http.get<HttpResponse<Eventu>>(`${this.apiUrl}/${id}`, { params });
  }

  deleteById(id: number): Observable<HttpResponse<Eventu>> {
    return this.http.delete<HttpResponse<Eventu>>(`${this.apiUrl}/${id}`);
  }
}
