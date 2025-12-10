import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Highlight } from '../models/highlight.model';
import { ApiResponse } from '../utils/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private baseUrl = 'http://localhost:8080/api/highlights';

  constructor(private http: HttpClient) {}

  createHighlight(dto: Partial<Highlight>): Observable<ApiResponse<Highlight>> {
    return this.http.post<ApiResponse<Highlight>>(this.baseUrl, dto);
  }

  updateHighlight(
    id: number,
    dto: Partial<Highlight>
  ): Observable<ApiResponse<Highlight>> {
    return this.http.put<ApiResponse<Highlight>>(`${this.baseUrl}/${id}`, dto);
  }

  deleteHighlight(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getHighlightById(id: number): Observable<ApiResponse<Highlight>> {
    return this.http.get<ApiResponse<Highlight>>(`${this.baseUrl}/${id}`);
  }

  getAllHighlights(): Observable<ApiResponse<Highlight[]>> {
    return this.http.get<ApiResponse<Highlight[]>>(this.baseUrl);
  }
}
