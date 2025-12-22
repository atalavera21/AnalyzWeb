import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { GoogleCallbackComponent } from "./components/google-callback/google-callback.component";
import { Verify2faComponent } from "./components/verify2fa/verify2fa.component";

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'callback',
    component: GoogleCallbackComponent
  },
  {
    path: 'verify-2fa',
    component: Verify2faComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];