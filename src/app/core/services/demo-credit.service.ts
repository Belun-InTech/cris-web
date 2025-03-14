import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Demographic } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class DemoCreditService {
 protected apiUrl = `${environment.apiUrl}/demo-credit`;

  constructor(
    private http: HttpClient
  ) { }

  searchByIdNumber(idNumber: string): Observable<Demographic> {
    return this.http.get<any>(`${this.apiUrl}/search/${idNumber.trim()}`).pipe(take(1));
  }
}
