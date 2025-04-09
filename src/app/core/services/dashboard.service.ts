import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  protected apiUrl = `${environment.apiUrl}/dashboards`;

  constructor(
    private http: HttpClient,
  ) { }

  public getDashboardData(year = new Date().getFullYear()): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${this.apiUrl}?year=${year}`, {});
  }
}
