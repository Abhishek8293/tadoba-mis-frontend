import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDTO } from '../models/login.model';
import { ApiResponse } from '../utils/apiresponse';
import { ChangePasswordDTO } from '../models/change-password.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://api.tadobasolutions.com/api/auth';

  constructor(private http: HttpClient) {}

  login(dto: LoginDTO): Observable<ApiResponse<LoginDTO>> {
    return this.http.post<ApiResponse<LoginDTO>>(`${this.baseUrl}/login`, dto);
  }

   changePassword(dto: ChangePasswordDTO): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/change-password`, dto);
  }
}
