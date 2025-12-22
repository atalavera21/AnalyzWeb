import { Routes } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { UserDashboardComponent } from "./components/user-dashboard/user-dashboard.component";

export const userRoutes: Routes = [
    {
        path: '',
        component: UserDashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard', 
                component: UserDashboardComponent
            }
        ]
    },
]