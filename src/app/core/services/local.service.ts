import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Aldeia, HttpResponse, HttpResponseList, Munisipiu, PostuAdministrativu, Suku } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private apiLokalUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
  ) { }

  getMunisipiuPagination(page?: number, size?: number): Observable<HttpResponseList<Munisipiu>> {
    // const params = new HttpParams()
    //   .append('populate[listaPostuAdministrativu]', '*');
    return this.http.get<HttpResponseList<Munisipiu>>(`${this.apiLokalUrl}/munisipius`);
  }


  getPostuListByMunicipioId(id: number): Observable<HttpResponseList<PostuAdministrativu>> {
    const params = new HttpParams()
      .append('filters[munisipiu][id][$eq]', id);
    return this.http.get<HttpResponseList<PostuAdministrativu>>(`${this.apiLokalUrl}/postu-administrativus`, { params });
  }

  getSukuListByPostuId(id: number): Observable<HttpResponseList<Suku>> {
    const params = new HttpParams()
      .append('filters[postuAdministrativu][id][$eq]', id);
    return this.http.get<HttpResponseList<Suku>>(`${this.apiLokalUrl}/sukus`, { params });
  }

  getAldeiaListBySukuId(id: number): Observable<HttpResponseList<Aldeia>> {
    const params = new HttpParams()
      .append('filters[suku][id][$eq]', id);
    return this.http.get<HttpResponseList<Aldeia>>(`${this.apiLokalUrl}/aldeias`, { params });
  }

}
