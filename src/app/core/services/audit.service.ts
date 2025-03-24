import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  protected apiUrl = `${environment.apiUrl}/audits`;

  constructor(
    private http: HttpClient,
  ) { }

  public getAllActions(startDateTime?: Date, endDateTime?: Date): Observable<any> {
    if (startDateTime && endDateTime) {
      const formattedStart = formatDate(startDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
      const formattedEnd = formatDate(endDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

      let params = new HttpParams();
      params = params.set('startDateTime', formattedStart)
      params = params.set('endDateTime', formattedEnd);

      return this.http.get(`${this.apiUrl}/actions`, { params }).pipe(take(1));
    } else {
      return this.http.get(`${this.apiUrl}/actions`).pipe(take(1));
    }
  }

  public getActionsByUsername(username: string, startDateTime?: Date, endDateTime?: Date): Observable<any> {
    if (startDateTime && endDateTime) {
      const formattedStart = formatDate(startDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
      const formattedEnd = formatDate(endDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

      let params = new HttpParams();
      params = params.set('startDateTime', formattedStart)
      params = params.set('endDateTime', formattedEnd);

      return this.http.get(`${this.apiUrl}/actions/user/${username}`, { params }).pipe(take(1));
    } else {
      return this.http.get(`${this.apiUrl}/actions/user/${username}`).pipe(take(1));
    }
  }

  public getLoginActivities(startDateTime?: Date, endDateTime?: Date): Observable<any> {
    if (startDateTime && endDateTime) {
      const formattedStart = formatDate(startDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
      const formattedEnd = formatDate(endDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

      let params = new HttpParams();
      params = params.set('startDateTime', formattedStart)
      params = params.set('endDateTime', formattedEnd);

      return this.http.get(`${this.apiUrl}/login`, { params }).pipe(take(1));
    } else {
      return this.http.get(`${this.apiUrl}/login`).pipe(take(1));
    }
  }

  public getLoginActivitiesByUsername(username: string, startDateTime?: Date, endDateTime?: Date): Observable<any> {
    if (startDateTime && endDateTime) {
      const formattedStart = formatDate(startDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
      const formattedEnd = formatDate(endDateTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');

      let params = new HttpParams();
      params = params.set('startDateTime', formattedStart)
      params = params.set('endDateTime', formattedEnd);

      return this.http.get(`${this.apiUrl}/login/${username}`, { params }).pipe(take(1));
    } else {
      return this.http.get(`${this.apiUrl}/login/${username}`).pipe(take(1));
    }
  }
}
