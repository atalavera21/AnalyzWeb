import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TwoFactorService } from "../../../../core/services/two-factor.service";
import { AuthService } from "../../../../core/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-verify2fa',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    CardModule
  ],
  templateUrl: './verify2fa.component.html',
  styleUrl: './verify2fa.component.css',
})
export class Verify2faComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private twoFactorService = inject(TwoFactorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  verifyForm!: FormGroup;
  loading = false;
  error = '';
  tempToken = '';
  useBackupCode = false;

  ngOnInit(): void {

    // Obtener tempToken de query params o navigation state
    this.route.queryParams.subscribe(params => {
      this.tempToken = params['tempToken'] || '';
    });

    if (!this.tempToken) {
      const navigation = this.router.getCurrentNavigation();
      this.tempToken = navigation?.extras?.state?.['tempToken'] || '';
    }

    if (!this.tempToken) {
      this.error = 'Token de sesión no válido. Por favor, inicia sesión nuevamente.';
      setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      return;
    }

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

  }

  get f() {
    return this.verifyForm.controls;
  }


  onCodeInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.verifyForm.patchValue({ code: value });
    
    // Auto-submit cuando tiene 6 dígitos
    if (value.length === 6) {
      this.onVerify();
    }
  }

  onVerify(): void {
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const request = {
      tempToken: this.tempToken,
      code: this.verifyForm.value.code,
      useBackupCode: this.useBackupCode
    };

    this.twoFactorService.validate2FA(request).subscribe({
      next: (response) => {
        if (response.success && response.data?.success) {
          // Usuario autenticado correctamente
          const user = response.data.user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService.currentUser.set(user);

          // Redirigir según rol
          if (user.roles.includes('Admin')) {
            this.router.navigate(['/admin/dashboard']);
          } else if (user.roles.includes('User')) {
            this.router.navigate(['/user/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error verificando 2FA:', err);
        this.error = err.error?.message || 'Código inválido. Intenta nuevamente.';
        this.loading = false;
        this.verifyForm.patchValue({ code: '' });
      }
    });
  }

}
