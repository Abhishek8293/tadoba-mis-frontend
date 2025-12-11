import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../utils/apiresponse';
import { ReportSummary } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = 'http://localhost:8080/api/report';

  constructor(private http: HttpClient) {}

  /** Get Monthly Report Summary */
  getEmployeeSummary(
    employeeId: number,
    month: number,
    year: number
  ): Observable<ApiResponse<ReportSummary>> {
    let params = new HttpParams()
      .set('employeeId', employeeId)
      .set('month', month)
      .set('year', year);

    return this.http.get<ApiResponse<ReportSummary>>(
      `${this.baseUrl}/employee-summary`,
      { params }
    );
  }

 downloadExcel(employeeId: number, month: number, year: number) {
  let params = new HttpParams()
    .set('employeeId', employeeId)
    .set('month', month)
    .set('year', year);

  return this.http.get(`${this.baseUrl}/employee-excel`, {
    params,
    responseType: 'blob',
    observe: 'response'  // IMPORTANT!!!
  });
}

}
