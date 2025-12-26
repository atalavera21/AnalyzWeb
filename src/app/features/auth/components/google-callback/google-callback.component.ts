import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-google-callback',
  imports: [CommonModule, ProgressSpinnerModule, MessageModule, ButtonModule],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css',
})
export class GoogleCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = true;
  error = '';

  ngOnInit(): void {
    this.handleCallback();
  }

  private handleCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');  // ✅ Código de autorización
    const errorParam = urlParams.get('error');
    const requires2FA = urlParams.get('requires2FA');
    const tempToken = urlParams.get('tempToken');

    // Manejar 2FA
    if (requires2FA === 'true' && tempToken) {
      console.log('🔐 Google Auth requiere 2FA');
      this.loading = false;
      this.router.navigate(['/auth/verify-2fa'], {
        queryParams: { tempToken },
      });
      return;
    }

    if (code) {
      console.log('🔑 Código recibido, intercambiando por cookie...');
      
      // Limpiar URL inmediatamente por seguridad
      window.history.replaceState({}, document.title, '/auth/callback');

      this.http.post(
        `${environment.apiUrl}/auth/exchange-code`,
        { code },
        { withCredentials: true }
      ).subscribe({
        next: () => {
          console.log('✅ Cookie establecida, obteniendo usuario...');
          this.getUserAndRedirect();
        },
        error: (err) => {
          console.error('❌ Error intercambiando código:', err);
          this.loading = false;
          this.error = 'Código de autorización inválido o expirado';
        }
      });
      return;
    }

    // Manejar error
    if (errorParam) {
      this.loading = false;
      this.error = decodeURIComponent(errorParam);
      return;
    }

    this.loading = false;
    this.error = 'Error desconocido en la autenticación';
  }

  private getUserAndRedirect(): void {
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
        console.error('Error obteniendo usuario:', error);
        this.loading = false;
        this.error = 'Error al obtener información del usuario.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}