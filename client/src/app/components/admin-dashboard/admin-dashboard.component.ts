import { Component } from '@angular/core';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ AddProductComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
