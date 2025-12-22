import { LoginResponse } from './../models/user.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
// import { 
//   TwoFactorSetupResponse, 
//   TwoFactorStatusResponse, 
//   Validate2FARequest,
//   LoginResponse 
// } from '../models/user.model';

import { 
    TwoFactorSetupResponse,
    TwoFactorStatusResponse,
    Validate2FARequest,
} from '../models/autenticacion-2fa.models'

@Injectable({ providedIn: 'root' })
export class TwoFactorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/2fa`;

  enable2FA(): Observable<ApiResponse<TwoFactorSetupResponse>> {
    return this.http.post<ApiResponse<TwoFactorSetupResponse>>(
      `${this.apiUrl}/enable`, 
      {},
      { withCredentials: true }
    );
  }

  verifySetup(code: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.apiUrl}/verify-setup`,
      { code },
      { withCredentials: true }
    );
  }

  validate2FA(request: Validate2FARequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/validate`,
      request,
      { withCredentials: true }
    );
  }

  get2FAStatus(): Observable<ApiResponse<TwoFactorStatusResponse>> {
    return this.http.get<ApiResponse<TwoFactorStatusResponse>>(
      `${this.apiUrl}/status`,
      { withCredentials: true }
    );
  }

  disable2FA(code : string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.apiUrl}/disable`,
      { code  },
      { withCredentials: true }
    );
  }
}