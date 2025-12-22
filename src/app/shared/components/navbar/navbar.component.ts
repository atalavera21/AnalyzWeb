import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;
  currentUser = this.authService.currentUser;
  loading = false;

  ngOnInit(): void {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.loading = false;
        this.isMenuOpen = false;
      },
      error: () => {
        this.loading = false;
        this.isMenuOpen = false;
      },
    });
  }

  navigateToUserArea(): void {
    const user = this.currentUser();
    if (user?.roles.includes('Admin')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user?.roles.includes('User')) {
      this.router.navigate(['/user/dashboard']);
    }
    this.isMenuOpen = false;
  }

  navigateToUserAreaAndClose(): void {
    this.navigateToUserArea();
    this.closeMenu();
  }
}