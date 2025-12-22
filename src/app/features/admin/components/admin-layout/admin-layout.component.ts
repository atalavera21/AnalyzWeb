import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  pageTitle = 'Dashboard';
  loading = false;

  ngOnInit(): void {
    this.updatePageTitle();
  }

  private updatePageTitle(): void {
    // Actualizar título basado en la ruta actual
    const url = this.router.url;
    if (url.includes('dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('surveys')) {
      this.pageTitle = 'Gestión de Encuestas';
    } else if (url.includes('analytics')) {
      this.pageTitle = 'Analíticas';
    }
  }

  logout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
