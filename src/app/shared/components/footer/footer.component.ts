import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, BadgeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {
    // Cualquier lógica de inicialización
  }

  // Métodos para manejar las acciones de los enlaces
  onSocialClick(platform: string): void {
    // Lógica para redes sociales
    console.log(`${platform} clicked`);
  }

  onLegalClick(section: string): void {
    // Lógica para enlaces legales
    console.log(`${section} legal section clicked`);
  }

  onSupportClick(section: string): void {
    // Lógica para sección de soporte
    console.log(`${section} support section clicked`);
  }
}
