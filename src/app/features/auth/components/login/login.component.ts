import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formulario
  loginForm!: FormGroup;

  loading = false;

  error = '';

  currentOrigin = '';
  isProduction = false;

  ngOnInit(): void {
    // Redirigir si ya está logueado
    if (this.authService.isAuthenticated()) {
      const user = this.authService.currentUser();
      if (user?.roles.includes('Admin')) {
        this.router.navigate(['/admin/dashboard']);
      } else if (user?.roles.includes('User')) {
        this.router.navigate(['/user/dashboard']);
      }
      return;
    }

    // Inicializar formulario
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // ✅ El AuthService maneja la redirección automáticamente
        // Si requiere 2FA, ya redirige a /auth/verify-2fa
        // Si no, establece usuario y redirige al dashboard
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.error = error.error?.message || 'Email o contraseña incorrectos';
        this.loading = false;
      },
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  clearErrors(): void {
    this.error = '';
  }
}
