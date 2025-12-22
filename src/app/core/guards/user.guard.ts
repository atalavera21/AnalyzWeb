import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const UserGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUser()) {
    return true;
  }

  // Si está autenticado pero no es user, redirigir a su dashboard correspondiente
  if (authService.isAuthenticated()) {
    if (authService.isAdmin()) {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/auth/login']);
    }
  } else {
    router.navigate(['/auth/login']);
  }
  
  return false;
};