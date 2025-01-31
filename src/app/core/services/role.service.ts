import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  protected apiUrl = `${environment.url}/roles`;

  constructor(
    private http: HttpClient,
  ) { }

  getList(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(take(1));
  }


}
