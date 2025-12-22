import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
} from '../models/user.model';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() {
    console.log(
      '🔧 AuthService Constructor - Usuario inicial:',
      this.currentUser()
    );
    
    if (this.currentUser()) {
      this.checkAuthStatus();
    }

    // this.checkAuthStatus();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('📦 getUserFromStorage:', user);
    return user;
  }

  checkAuthStatus(): void {
    this.getCurrentUser().subscribe({
      next: (user) => {
        console.log('✅ Usuario autenticado:', user);
      },
      error: (err) => {
        console.error('❌ Error verificando autenticación:', err);
        if (err.status === 401) {
          localStorage.removeItem('currentUser');
          this.currentUser.set(null);
        }
      },
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            // ✅ VERIFICAR SI REQUIERE 2FA
            if (response.data.requires2FA && response.data.tempToken) {
              console.log('🔐 Login requiere 2FA, redirigiendo...');
              this.router.navigate(['/auth/verify-2fa'], {
                queryParams: { tempToken: response.data.tempToken },
              });
            } else if (response.data.success) {
              // Login completo sin 2FA
              const user = response.data.user;
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUser.set(user);
              this.redirectUserByRole(user);
            }
          }
        })
      );
  }

  loginWithGoogle(): void {
    const googleAuthUrl = `${environment.apiUrl}/auth/google`;
    window.location.href = googleAuthUrl;
  }

  handleGoogleCallback(): Observable<User> {
    return new Observable((observer) => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const error = urlParams.get('error');
      const requires2FA = urlParams.get('requires2FA'); // ✅ NUEVO
      const tempToken = urlParams.get('tempToken'); // ✅ NUEVO

      // ✅ MANEJAR CASO DE 2FA
      if (requires2FA === 'true' && tempToken) {
        console.log('🔐 Google Auth requiere 2FA');
        this.router.navigate(['/auth/verify-2fa'], {
          queryParams: { tempToken },
        });
        observer.complete();
        return;
      }

      if (success === 'true') {
        this.getCurrentUser().subscribe({
          next: (user) => {
            observer.next(user);
            observer.complete();
          },
          error: (err) => {
            observer.error('Token de autenticación inválido');
          },
        });
      } else if (error) {
        observer.error(decodeURIComponent(error));
      } else {
        observer.error('Error desconocido en la autenticación');
      }
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/Users/register`,
      userData
    );
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${environment.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('currentUser');
          this.currentUser.set(null);
          this.router.navigate(['/']);
        }),
        catchError(() => {
          localStorage.removeItem('currentUser');
          this.currentUser.set(null);
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            const user: User = {
              id: response.data.id,
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              fullName: response.data.fullName,
              createdAt: response.data.createdAt,
              lastLoginAt: response.data.lastLoginAt,
              roles: response.data.roles,
              profilePicture: response.data.profilePicture
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser.set(user);
            return user;
          }
          throw new Error('Failed to get user profile');
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }

  private redirectUserByRole(user: User): void {
    if (user.roles.includes(UserRole.ADMIN)) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.roles.includes(UserRole.USER)) {
      this.router.navigate(['/user/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
