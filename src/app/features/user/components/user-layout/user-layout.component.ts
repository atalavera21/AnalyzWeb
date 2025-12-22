import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  loading = false;

  ngOnInit(): void { }

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
