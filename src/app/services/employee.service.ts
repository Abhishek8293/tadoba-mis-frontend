import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../utils/apiresponse';
import { EmployeeResponseDTO, EmployeeRequestDTO } from '../models/employee.model';


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'https://api.tadobasolutions.com/api/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<ApiResponse<EmployeeResponseDTO[]>> {
    return this.http.get<ApiResponse<EmployeeResponseDTO[]>>(this.baseUrl);
  }

  getEmployeeById(id: number): Observable<ApiResponse<EmployeeResponseDTO>> {
    return this.http.get<ApiResponse<EmployeeResponseDTO>>(
      `${this.baseUrl}/${id}`
    );
  }

  createEmployee(
    dto: EmployeeRequestDTO
  ): Observable<ApiResponse<EmployeeResponseDTO>> {
    return this.http.post<ApiResponse<EmployeeResponseDTO>>(this.baseUrl, dto);
  }

  updateEmployee(
    id: number,
    dto: EmployeeRequestDTO
  ): Observable<ApiResponse<EmployeeResponseDTO>> {
    return this.http.put<ApiResponse<EmployeeResponseDTO>>(
      `${this.baseUrl}/${id}`,
      dto
    );
  }

  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
