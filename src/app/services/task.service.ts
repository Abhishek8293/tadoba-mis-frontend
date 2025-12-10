import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TaskRequestDTO,
  TaskResponseDTO,
  TaskStatusCountDTO,
} from '../models/task.model';
import { ApiResponse } from '../utils/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  createTask(dto: TaskRequestDTO): Observable<ApiResponse<TaskResponseDTO>> {
    return this.http.post<ApiResponse<TaskResponseDTO>>(this.baseUrl, dto);
  }

  updateTask(
    id: number,
    dto: TaskRequestDTO
  ): Observable<ApiResponse<TaskResponseDTO>> {
    return this.http.put<ApiResponse<TaskResponseDTO>>(
      `${this.baseUrl}/${id}`,
      dto
    );
  }

  deleteTask(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getTaskById(id: number): Observable<ApiResponse<TaskResponseDTO>> {
    return this.http.get<ApiResponse<TaskResponseDTO>>(`${this.baseUrl}/${id}`);
  }

  getAllTasks(
    taskStatus?: string,
    employeeId?: number,
    targetDate?: string
  ): Observable<ApiResponse<TaskResponseDTO[]>> {
    let params = new HttpParams();
    if (taskStatus) params = params.set('taskStatus', taskStatus);
    if (employeeId) params = params.set('employeeId', employeeId.toString());
    if (targetDate) params = params.set('targetDate', targetDate);

    return this.http.get<ApiResponse<TaskResponseDTO[]>>(this.baseUrl, {
      params,
    });
  }

  submitTask(id: number): Observable<ApiResponse<TaskResponseDTO>> {
    return this.http.put<ApiResponse<TaskResponseDTO>>(
      `${this.baseUrl}/${id}/submit`,
      {}
    );
  }

  getTaskStatusCounts(
    employeeId?: number
  ): Observable<ApiResponse<TaskStatusCountDTO>> {
    let params = new HttpParams();
    if (employeeId !== undefined && employeeId !== null) {
      params = params.set('employeeId', employeeId.toString());
    }

    return this.http.get<ApiResponse<TaskStatusCountDTO>>(
      `${this.baseUrl}/status-counts`,
      { params }
    );
  }
}
