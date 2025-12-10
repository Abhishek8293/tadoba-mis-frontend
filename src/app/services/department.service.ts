import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentDTO } from '../models/department.model';
import { ApiResponse } from '../utils/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  createDepartment(name: string): Observable<ApiResponse<DepartmentDTO>> {
    return this.http.post<ApiResponse<DepartmentDTO>>(
      `${this.baseUrl}?name=${encodeURIComponent(name)}`,
      {}
    );
  }

  updateDepartment(
    id: number,
    name: string,
    inchargeId?: number
  ): Observable<ApiResponse<DepartmentDTO>> {
    let params = new HttpParams().set('name', name);

    if (inchargeId !== undefined && inchargeId !== null) {
      params = params.set('inchargeId', inchargeId.toString());
    }

    return this.http.put<ApiResponse<DepartmentDTO>>(
      `${this.baseUrl}/${id}`,
      {},
      { params }
    );
  }

  deleteDepartment(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getDepartmentById(id: number): Observable<ApiResponse<DepartmentDTO>> {
    return this.http.get<ApiResponse<DepartmentDTO>>(`${this.baseUrl}/${id}`);
  }

  getAllDepartments(): Observable<ApiResponse<DepartmentDTO[]>> {
    return this.http.get<ApiResponse<DepartmentDTO[]>>(this.baseUrl);
  }
}
