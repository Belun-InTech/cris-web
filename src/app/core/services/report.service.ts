import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreditFilter, DemographicFilter, Log, LogFilter } from '../models/data';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected apiUrl = `${environment.apiUrl}/reports`;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Generates a report of credit data, filtered by the given parameters.
   * @param filter A `CreditFilter` object with the desired filter criteria.
   * @returns An observable of the report, which is an array of objects with the
   * following properties:
   * - `id`: The ID of the credit
   * - `fullName`: The full name of the credit
   * - `idNumber`: The ID number of the credit
   * - `creditAmount`: The amount of the credit
   * - `grantedAt`: The date the credit was granted
   * - `creditClassification`: The classification of the credit
   * - `collateral`: The collateral backing the credit
   * - `maturity`: The maturity date of the credit
   * - `guarantor`: The name of the guarantor of the credit (if applicable)
   * - `guarantee`: The amount of the guarantee (if applicable)
   * - `instalmentAmount`: The amount of each instalment
   * - `instalmentFrequency`: The frequency of the instalments
   * - `instalmentDuration`: The duration of the instalments
   * - `state`: The current state of the credit
   * - `typeCredit`: The type of credit
   * - `beneficiary`: The name of the beneficiary
   * - `beneficiaryType`: The type of beneficiary (if applicable)
   * - `beneficiaryIdNumber`: The ID number of the beneficiary (if applicable)
   */
  getCreditsReport(filter: CreditFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/credits`, filter);
  }

  /**
   * Generates a report of demographic data, filtered by the given parameters.
   * @param filter A `DemographicFilter` object with the desired filter criteria.
   * @returns An observable of the report, which is an array of objects with the
   * following properties:
   * - `id`: The ID of the demographic
   * - `fullName`: The full name of the demographic
   * - `idNumber`: The ID number of the demographic
   * - `gender`: The gender of the demographic
   * - `city`: The name of the city where the demographic resides
   * - `beneficiaryType`: The type of beneficiary (if applicable)
   * - `beneficiaryIdNumber`: The ID number of the beneficiary (if applicable)
   */
  getDemographicReport(filter: DemographicFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/demographics`, filter);
  }

  /**
   * Generates a report of log activities, filtered by the specified parameters.
   * Formats the `fromDate` and `toDate` fields if they are provided.
   * 
   * @param filter A `LogFilter` object containing the criteria for filtering log activities.
   * @returns An observable of the report, which is an array of `Log` objects.
   */

  getLogActivitiesReport(filter: LogFilter): Observable<Log[]> {
    if (filter.fromDate && filter.toDate) {
      filter.fromDate = formatDate(filter.fromDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
      filter.toDate = formatDate(filter.toDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
    }
    return this.http.post<Log[]>(`${this.apiUrl}/logs`, filter);
  }
}
