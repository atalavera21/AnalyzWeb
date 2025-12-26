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
import {
  RegisterRequest,
  Gender,
  GenderOption,
} from '../../../../core/models/user.model';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    CalendarModule,
    RadioButtonModule,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  loading = false;
  error = '';
  success = false;

  genderOptions: GenderOption[] = [
    { label: 'Masculino', value: Gender.MALE },
    { label: 'Femenino', value: Gender.FEMALE },
    { label: 'Otro', value: Gender.OTHER },
  ];

  date = new Date();

  // Configuración para el calendario
  maxDate = new Date();
  minDate = new Date();

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

    // Configurar fechas límite (18-100 años)
    this.minDate.setDate(this.minDate.getDate() - 10);
    this.maxDate.setDate(this.maxDate.getDate() + 10);

    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9._]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        dateofBirth: [null, [Validators.required]],
        gender: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validador personalizado para contraseña segura
  private passwordValidator(control: any) {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);

    const valid = hasNumber && hasUpper && hasLower;

    if (!valid) {
      return { weakPassword: true };
    }
    return null;
  }

  // Validador para confirmar contraseña
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = this.registerForm.value;
    const registerData: RegisterRequest = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      dateofBirth: this.formatDate(formData.dateofBirth),
      gender: formData.gender,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.success = true;

        // ✅ Login automático con las credenciales recién creadas
        this.authService
          .login({
            email: formData.email,
            password: formData.password,
          })
          .subscribe({
            next: (loginResponse) => {
              console.log('✅ Login automático exitoso');
              this.loading = false;
              // El AuthService ya redirige al dashboard según el rol
            },
            error: (loginError) => {
              console.error('Error en login automático:', loginError);
              this.loading = false;
              // Si falla el login automático, redirigir al login manual
              this.router.navigate(['/auth/login'], {
                queryParams: { registered: 'true' },
              });
            },
          });
      },
      error: (error) => {
        console.error('❌ Error en registro:', error);
        this.loading = false;

        if (error.status === 400) {
          this.error =
            'Los datos proporcionados no son válidos. Verifica la información.';
        } else if (error.status === 409) {
          this.error = 'El email o nombre de usuario ya están registrados.';
        } else if (error.error?.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Error al crear la cuenta. Intenta nuevamente.';
        }
      },
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
