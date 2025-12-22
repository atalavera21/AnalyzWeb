import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Si está autenticado pero no es admin, redirigir a su dashboard correspondiente
  if (authService.isAuthenticated()) {
    if (authService.isUser()) {
      router.navigate(['/user/dashboard']);
    } else {
      router.navigate(['/auth/login']);
    }
  } else {
    router.navigate(['/auth/login']);
  }
  
  return false;
};