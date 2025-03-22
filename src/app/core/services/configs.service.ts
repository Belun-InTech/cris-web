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


  /**
   * Retrieves the email configuration from the server.
   *
   * @returns An observable containing the email configuration.
   */
  getEmail(): Observable<EmailConfig> {
    return this.http.get<EmailConfig>(`${this.apiUrl}/email/get`).pipe(take(1));
  }


  /**
   * Saves the email configuration to the server.
   *
   * @param form The email configuration to be saved.
   * @returns An observable of the saved email configuration.
   */

  saveEmail(form: EmailConfig): Observable<EmailConfig> {
    return this.http.post<EmailConfig>(`${this.apiUrl}/email`, form).pipe(take(1));
  }

  /**
   * Tests the email configuration by sending a test email to the specified address.
   *
   * @returns An observable of the server response indicating the success or failure of the test.
   */


  testEmailConfig(emailTo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/email/test`, emailTo).pipe(take(1));
  }

  /**
   * Retrieves the LDAP/AD configuration from the server.
   *
   * @returns An observable containing the LDAP/AD configuration.
   */
  getLdap(): Observable<LdapConfig> {
    return this.http.get<LdapConfig>(`${this.apiUrl}/ldap/get`).pipe(take(1));
  }

  /**
   * Saves the LDAP/AD configuration to the server.
   *
   * @param form The LDAP/AD configuration to be saved.
   * @returns An observable of the saved LDAP/AD configuration.
   */
  saveLdap(form: LdapConfig): Observable<LdapConfig> {
    return this.http.post<LdapConfig>(`${this.apiUrl}/ldap`, form).pipe(take(1));
  }

  /**
   * Tests the LDAP/AD configuration by sending a request to the server.
   *
   * @returns An observable of the server response indicating the success or failure of the test.
   */

  testLdapConfig(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ldap/test`, {}).pipe(take(1));
  }
}
