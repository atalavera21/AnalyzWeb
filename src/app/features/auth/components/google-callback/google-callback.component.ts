import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-google-callback',
  imports: [CommonModule, ProgressSpinnerModule, MessageModule, ButtonModule],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css',
})
export class GoogleCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = true;
  error = '';

  ngOnInit(): void {
    this.handleCallback();
  }

  // google-callback.component.ts
  private handleCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const errorParam = urlParams.get('error');
    const requires2FA = urlParams.get('requires2FA'); // ✅ NUEVO
    const tempToken = urlParams.get('tempToken'); // ✅ NUEVO

    // ✅ MANEJAR 2FA PRIMERO
    if (requires2FA === 'true' && tempToken) {
      console.log('🔐 Google Auth requiere 2FA');
      this.loading = false;
      this.router.navigate(['/auth/verify-2fa'], {
        queryParams: { tempToken },
      });
      return;
    }

    if (success === 'true') {
      // Flujo normal sin 2FA
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.loading = false;
          if (user?.roles.includes('Admin')) {
            this.router.navigate(['/admin/dashboard']);
          } else if (user?.roles.includes('User')) {
            this.router.navigate(['/user/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error en Google callback:', error);
          this.loading = false;
          this.error = 'Error al obtener información del usuario.';
        },
      });
    } else if (errorParam) {
      this.loading = false;
      this.error = decodeURIComponent(errorParam);
    } else {
      this.loading = false;
      this.error = 'Error desconocido en la autenticación';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
