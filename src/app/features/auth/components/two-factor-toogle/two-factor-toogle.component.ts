import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoFactorService } from '../../../../core/services/two-factor.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-factor-toogle',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    DividerModule,
    ToastModule,
    CardModule
  ],
  templateUrl: './two-factor-toogle.component.html',
  styleUrl: './two-factor-toogle.component.css',
  providers: [MessageService]
})
export class TwoFactorToogleComponent implements OnInit {
  private twoFactorService = inject(TwoFactorService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  is2FAEnabled = false;
  backupCodesRemaining: number | null = null;
  loading = false;

  // Activar 2FA
  showEnableDialog = false;
  setupData: any = null;
  currentStep: 'qr' | 'verify' | 'backup' = 'qr';
  setupError = '';
  verifyForm!: FormGroup;

  // Desactivar 2FA
  showDisableDialog = false;
  disableError = '';
  disableForm!: FormGroup;

  ngOnInit(): void {
    this.loadStatus();

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.disableForm = this.fb.group({
       code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] 
    });    
  }

  loadStatus(): void {
    this.twoFactorService.get2FAStatus().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.is2FAEnabled = response.data.isEnabled;
          this.backupCodesRemaining = response.data.backupCodesRemaining;
        }
      },
      error: (err) => {
        console.error('Error cargando estado 2FA:', err);
      }
    });
  }

  openEnableDialog(): void {
    this.loading = true;
    this.setupError = '';
    
    this.twoFactorService.enable2FA().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.setupData = response.data;
          this.currentStep = 'qr';
          this.showEnableDialog = true;
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo iniciar la configuración de 2FA'
        });
        this.loading = false;
      }
    });
  }

  onCodeInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.verifyForm.patchValue({ code: value }, { emitEvent: false });
  }

  verifyAndActivate(): void {
    if (this.verifyForm.invalid) return;

    this.loading = true;
    this.setupError = '';

    this.twoFactorService.verifySetup(this.verifyForm.value.code).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentStep = 'backup';
          this.messageService.add({
            severity: 'success',
            summary: '¡Activado!',
            detail: '2FA configurado correctamente'
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.setupError = 'Código inválido. Verifica que sea el correcto y que no haya expirado.';
        this.verifyForm.patchValue({ code: '' });
        this.loading = false;
      }
    });
  }

  finishSetup(): void {
    this.showEnableDialog = false;
    this.setupData = null;
    this.verifyForm.reset();
    this.currentStep = 'qr';
    this.loadStatus();
  }

  openDisableDialog(): void {
    this.disableForm.reset();
    this.disableError = '';
    this.showDisableDialog = true;
  }

  disableTwoFactor(): void {
    if (this.disableForm.invalid) return;

    this.loading = true;
    this.disableError = '';

    this.twoFactorService.disable2FA(this.disableForm.value.code).subscribe({
      next: (response) => {
        if (response.success) {
          this.showDisableDialog = false;
          this.loadStatus();
          this.messageService.add({
            severity: 'info',
            summary: 'Deshabilitado',
            detail: '2FA ha sido deshabilitado de tu cuenta'
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.disableError = 'Código 2FA inválido. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }


}
