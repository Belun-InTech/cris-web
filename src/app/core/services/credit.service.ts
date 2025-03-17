import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Credit } from '../models/data';

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
    params.append('idNumber', idNumber);
    return this.http.get<Credit>(`${this.apiUrl}/${id}?idNumber=${idNumber}`).pipe(take(1));
  }

  updateById(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(take(1));
  }
}
