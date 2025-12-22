import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    PanelModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  scrollToFeatures(): void {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  // ...existing code...
  onStartNow(): void {
    // Acción al hacer clic en "Comenzar Ahora"
  }

  onViewDemo(): void {
    // Acción al hacer clic en "Ver Demo"
  }

  onExploreAI(): void {
    // Acción al hacer clic en "Explorar IA"
  }

  onCreateAccount(): void {
    // Acción al hacer clic en "Crear Cuenta Gratuita"
  }

  onContactSales(): void {
    // Acción al hacer clic en "Contactar Ventas"
  }
  // ...existing code...
}
