import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notice } from '../models/notice.model';
import { ApiResponse } from '../utils/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private baseUrl = 'http://localhost:8080/api/notices';

  constructor(private http: HttpClient) {}

  createNotice(dto: Partial<Notice>): Observable<ApiResponse<Notice>> {
    return this.http.post<ApiResponse<Notice>>(this.baseUrl, dto);
  }

  updateNotice(
    id: number,
    dto: Partial<Notice>
  ): Observable<ApiResponse<Notice>> {
    return this.http.put<ApiResponse<Notice>>(`${this.baseUrl}/${id}`, dto);
  }

  deleteNotice(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getNoticeById(id: number): Observable<ApiResponse<Notice>> {
    return this.http.get<ApiResponse<Notice>>(`${this.baseUrl}/${id}`);
  }

  getAllNotices(): Observable<ApiResponse<Notice[]>> {
    return this.http.get<ApiResponse<Notice[]>>(this.baseUrl);
  }
}
