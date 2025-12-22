import { User } from './core/models/user.model';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { UserDashboardComponent } from './features/user/components/user-dashboard/user-dashboard.component';
import { UserGuard } from './core/guards/user.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.adminRoutes),
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./features/user/user.route').then(r => r.userRoutes),
        canActivate: [AuthGuard, UserGuard]
    }    
];
