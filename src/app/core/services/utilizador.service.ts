import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse, HttpResponseList, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilizadorService {
  private apiUrl = `${environment.apiUrl}/users`;
  private apiUrlUserRegister = `${environment.apiUrl}/auth/local/register`

  constructor(
    private http: HttpClient,
  ) { }

  save(form: User): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(this.apiUrlUserRegister, form);
  }

  updateById(id: number, form: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, form);
  }

  getPagination(page?: number, size?: number): Observable<User[]> {
    let params = new HttpParams()
      .append('sort', 'createdAt:desc');
    if (page && size) {
      params.append('page', page)
      params.append('size', size);
      return this.http.get<User[]>(this.apiUrl, { params });
    } else {
      return this.http.get<User[]>(this.apiUrl, { params });
    }
  }

  getBySearchQuery(query: string): Observable<User[]> {
    const params = new HttpParams()
      .append('filters[$or][0][naran][$contains]', query)
      .append('filters[$or][1][sigla][$contains]', query)
      .append('sort', 'updatedAt:desc')
    return this.http.get<User[]>(`${this.apiUrl}`, { params });
  }

  deleteById(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
}
