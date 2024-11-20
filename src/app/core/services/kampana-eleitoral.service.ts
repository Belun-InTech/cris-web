import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse, HttpResponseList, TipuKampana } from '../models';
import { KampanaEleitoral } from '../models/kampana-eleitoral';

@Injectable({
  providedIn: 'root'
})
export class KampanaEleitoralService {
  private apiLokalUrl = `${environment.apiUrl}/kampana-elitorals`;
  private apiLokalUrlTipu = `${environment.apiUrl}/tipu-kampanas`;

  constructor(
    private http: HttpClient,
  ) { }

  save(form: any): Observable<HttpResponse<KampanaEleitoral>> {
    return this.http.post<HttpResponse<KampanaEleitoral>>(`${this.apiLokalUrl}`, { data: form });
  }

  updateById(id: number, form: KampanaEleitoral): Observable<HttpResponse<KampanaEleitoral>> {
    return this.http.put<HttpResponse<KampanaEleitoral>>(`${this.apiLokalUrl}/${id}`, { data: form });
  }

  getPagination(page: number, size: number): Observable<HttpResponseList<KampanaEleitoral>> {
    const params = new HttpParams()
      .append('populate[aldeia][populate][suku][populate][postuAdministrativu][populate][munisipiu]', '*')
      .append('pagination[page]', page)
      .append('pagination[pageSize]', size)
      .append('populate[eventu]', '*')
      .append('populate[partidu]', '*')
      .append('populate[koligasaun]', '*')
      .append('sort', 'updatedAt:desc')

    return this.http.get<HttpResponseList<KampanaEleitoral>>(`${this.apiLokalUrl}`, { params });
  }

  getById(id: number): Observable<HttpResponse<KampanaEleitoral>> {
    const params = new HttpParams()
      .append('populate[aldeia][populate][suku][populate][postuAdministrativu][populate][munisipiu]', '*')
      .append('populate[eventu][populate][listaPartidu]', '*')
      .append('populate[eventu][populate][listaKoligasaun]', '*')
      .append('populate[partidu]', '*')
      .append('populate[koligasaun]', '*')
      .append('populate[tipuKampana]', '*')
    return this.http.get<HttpResponse<KampanaEleitoral>>(`${this.apiLokalUrl}/${id}`, { params });
  }

  getAllTipuKamapana(): Observable<HttpResponseList<TipuKampana>> {
    return this.http.get<any>(`${this.apiLokalUrlTipu}`);
  }

  getBySearchQuery(query: string): Observable<HttpResponseList<KampanaEleitoral>> {
    const params = new HttpParams()
      .append('filters[$or][0][partidu][naran][$contains]', query)
      .append('filters[$or][1][koligasaun][naran][$contains]', query)
      .append('filters[$or][2][naranOfisialMonitorizasaun][$contains]', query)
      .append('populate[aldeia][populate][suku][populate][postuAdministrativu][populate][munisipiu]', '*')
      .append('populate[eventu][populate][listaPartidu]', '*')
      .append('populate[eventu][populate][listaKoligasaun]', '*')
      .append('populate[partidu]', '*')
      .append('populate[koligasaun]', '*')
      .append('populate[tipuKampana]', '*')
      .append('sort', 'updatedAt:desc')
    return this.http.get<HttpResponseList<KampanaEleitoral>>(`${this.apiLokalUrl}`, { params });
  }

  deleteById(id: number): Observable<HttpResponse<KampanaEleitoral>> {
    return this.http.delete<HttpResponse<KampanaEleitoral>>(`${this.apiLokalUrl}/${id}`);
  }
}
