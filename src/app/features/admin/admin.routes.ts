import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./components/admin-layout/admin-layout.component";
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: AdminDashboardComponent
            }        
        ]
    }
]