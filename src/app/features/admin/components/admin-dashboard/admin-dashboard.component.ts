import { Component, inject, OnInit } from '@angular/core';
import { TwoFactorToogleComponent } from "../../../auth/components/two-factor-toogle/two-factor-toogle.component";
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    TwoFactorToogleComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);

  // Métricas principales del dashboard
  totalComments = 0;
  newCommentsToday = 0;
  totalProducts = 0;
  activeCategories = 0;
  activeUsers = 0;
  totalUsers = 0;
  averageSentiment = 0;

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // TODO: Implementar llamada al backend para obtener estadísticas del dashboard
    // Por ahora valores de ejemplo
    this.totalComments = 0;
    this.newCommentsToday = 0;
    this.totalProducts = 0;
    this.activeCategories = 0;
    this.activeUsers = 0;
    this.totalUsers = 0;
    this.averageSentiment = 0;
  }

  // Getters para información del administrador
  currentUser = this.authService.currentUser;

  getAdminFullName(): string {
    const user = this.authService.currentUser();
    return user?.fullName || `${user?.firstName} ${user?.lastName}` || 'Administrador';
  }

  getAdminEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  getAdminCreatedDate(): string {
    const createdAt = this.authService.currentUser()?.createdAt;
    if (!createdAt) return 'N/A';
    return new Date(createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Métodos de navegación y gestión
  manageProducts(): void {
    // TODO: Navegar a página de gestión de productos/servicios
    console.log('Gestionar productos/servicios');
  }

  manageCategories(): void {
    // TODO: Navegar a página de gestión de categorías
    console.log('Gestionar categorías');
  }

  viewAllComments(): void {
    // TODO: Navegar a página de todos los comentarios
    console.log('Ver todos los comentarios');
  }

  viewDetailedReports(): void {
    // TODO: Navegar a página de reportes detallados o descargar reporte
    console.log('Ver reportes detallados');
  }
}
