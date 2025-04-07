import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreditFilter } from '../models/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected apiUrl = `${environment.apiUrl}/reports`;

  constructor(
    private http: HttpClient
  ) { }

  getCreditsReport(filter: CreditFilter): Observable<any> {
    return this.http.post(`${this.apiUrl}/credits`, filter);
  }
}
