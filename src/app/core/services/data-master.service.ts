import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataMasterService {
  protected apiUrl = `${environment.url}`;

  constructor(
    private http: HttpClient
  ) { }

  save(type: string, form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${type}`, form).pipe(take(1));
  }

  /**
   * Updates a custom data on the server with the provided data.
   * Works for all (bank,sector,type of collateral & credit classification)
   * 
   * @param url The URL of the resource to update.
   * @param form The data to be sent to the server for updating the resource.
   * @returns An observable of the server response.
   */

  update(url: string, form: any): Observable<any> {
    return this.http.put<any>(url, form).pipe(take(1));
  }

  //#region Bank 
  /**
   * Retrieves a list of all banks.
   * @returns An observable of the server response.
   */
  getListFinancialInstitution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/financial-institutions`).pipe(take(1));
  }

  /**
   * Saves a bank to the server.
   * @param form The bank object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveFinancialInstitution(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/financial-institutions`, form).pipe(take(1));
  }
  //#endregion Bank

  //#region FAQs

  /**
   * Retrieves a list of all FAQs.
   * @returns An observable of the server response.
   */
  getListFaq(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/faqs`).pipe(take(1));
  }


  /**
   * Saves a FAQ to the server.
   * @param form The FAQ object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveFaq(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/faqs`, form).pipe(take(1));
  }
  //#endregion FAQs

  //#region Sectors

  /**
   * Retrieves a list of all sectors.
   * @returns An observable of the server response.
   */
  getListSector(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sectors`).pipe(take(1));
  }

  /**
   * Saves a sector to the server.
   * @param form The sector object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveSector(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sectors`, form).pipe(take(1));
  }
  //#endregion Sectors

  //#region Type of Collateral

  /**
   * Retrieves a list of all types of collateral.
   * @returns An observable of the server response.
   */
  getListTypeCollateral(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-collaterals`).pipe(take(1));
  }

  /**
   * Saves a type of collateral to the server.
   * @param form The type of collateral object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveTypeCollateral(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/type-collaterals`, form).pipe(take(1));
  }

  //#endregion Type of Collateral

  //#region Credit Classification

  /**
   * Retrieves a list of all credit classifications.
   * @returns An observable of the server response.
   */
  getListCreditClassification(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/credit-classifications`).pipe(take(1));
  }

  /**
   * Saves a credit classification to the server.
   * @param form The credit classification object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveCreditClassification(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/credit-classifications`, form).pipe(take(1));
  }

  //#endregion Credit Classification

  //#region City

  /**
   * Retrieves a list of all cities.
   * @returns An observable of the server response.
   */
  getListCity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cities`).pipe(take(1));
  }

  /**
   * Saves a city to the server.
   * @param form The city object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveCity(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cities`, form).pipe(take(1));
  }
  //#endregion City


  //region Institution

  /**
   * Retrieves a list of all institutions.
   * @returns An observable of the server response.
   */

  getListInstitution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/institutions`).pipe(take(1));
  }

  /**
   * Saves an institution to the server.
   * @param form The institution object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveInstitution(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/institutions`, form).pipe(take(1));
  }
  //#endregion Institution



  //region Marital Status

  /**
   * Retrieves a list of all marital statuses.
   * @returns An observable of the server response.
   */
  getListMaritalStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marital-status`).pipe(take(1));
  }

  /**
   * Saves a marital status to the server.
   * @param form The marital status object to be sent to the server.
   * @returns An observable of the server response.
   */
  saveMaritalStatus(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marital-status`, form).pipe(take(1));
  }
  //#endregion Marital Status
}
