import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailConfig, LdapConfig } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  protected apiUrl = `${environment.apiUrl}/configs`;

  constructor(
    private http: HttpClient,
  ) { }

  getEmail(): Observable<EmailConfig> {
    return this.http.get<EmailConfig>(`${this.apiUrl}/email/get`).pipe(take(1));
  }

  saveEmail(form: EmailConfig): Observable<EmailConfig> {
    return this.http.post<EmailConfig>(`${this.apiUrl}/email`, form).pipe(take(1));
  }

  getLdap(): Observable<LdapConfig> {
    return this.http.get<LdapConfig>(`${this.apiUrl}/ldap/get`).pipe(take(1));
  }

  saveLdap(form: LdapConfig): Observable<LdapConfig> {
    return this.http.post<LdapConfig>(`${this.apiUrl}/ldap`, form).pipe(take(1));
  }
}
