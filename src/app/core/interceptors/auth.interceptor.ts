import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // NO inyectar AuthService - causa dependencia circular
  
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Limpiar localStorage directamente
        localStorage.removeItem('currentUser');
        router.navigate(['/auth/login']);
      }
      
      if (error.status === 403) {
        // Leer usuario de localStorage directamente
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.roles?.includes('Admin')) {
            router.navigate(['/admin/dashboard']);
          } else if (user.roles?.includes('User')) {
            router.navigate(['/user/dashboard']);
          } else {
            router.navigate(['/']);
          }
        } else {
          router.navigate(['/']);
        }
      }

      return throwError(() => error);
    })
  );
};