import { Component, inject, OnInit } from '@angular/core';
import { TwoFactorToogleComponent } from "../../../auth/components/two-factor-toogle/two-factor-toogle.component";
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    TwoFactorToogleComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  private authService = inject(AuthService);

  // Estadísticas del usuario
  totalComments = 0;
  categoriesReviewed = 0;
  lastActivityDate = 'Sin actividad';

  ngOnInit(): void {
    // Aquí se cargarán las estadísticas reales desde el backend
    this.loadUserStats();
  }

  loadUserStats(): void {
    // TODO: Implementar llamada al backend para obtener estadísticas
    // Por ahora valores de ejemplo
    this.totalComments = 0;
    this.categoriesReviewed = 0;
    this.lastActivityDate = 'Sin actividad';
  }

  // Getters para información del usuario
  currentUser = this.authService.currentUser;

  getUserFirstName(): string {
    return this.authService.currentUser()?.firstName || 'Usuario';
  }

  getUserFullName(): string {
    const user = this.authService.currentUser();
    return user?.fullName || `${user?.firstName} ${user?.lastName}` || 'Usuario';
  }

  getUserEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  getUserCreatedDate(): string {
    const createdAt = this.authService.currentUser()?.createdAt;
    if (!createdAt) return 'N/A';
    return new Date(createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Métodos de navegación y acciones
  openNewReview(): void {
    // TODO: Abrir modal o navegar a página de nueva opinión
    console.log('Abrir formulario de nueva opinión');
  }

  exploreCategories(): void {
    // TODO: Navegar a página de categorías
    console.log('Explorar categorías');
  }

  viewMyComments(): void {
    // TODO: Navegar a página de mis comentarios
    console.log('Ver mis comentarios');
  }

  viewMyAnalytics(): void {
    // TODO: Navegar a página de análisis personales
    console.log('Ver mis análisis');
  }
}
