import { Component } from '@angular/core';
import { TwoFactorToogleComponent } from "../../../auth/components/two-factor-toogle/two-factor-toogle.component";

@Component({
  selector: 'app-user-dashboard',
  imports: [
    TwoFactorToogleComponent
],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
