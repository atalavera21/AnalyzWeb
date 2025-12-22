import { Component } from '@angular/core';
import { TwoFactorToogleComponent } from "../../../auth/components/two-factor-toogle/two-factor-toogle.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [TwoFactorToogleComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
