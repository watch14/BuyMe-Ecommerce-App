import { Component } from '@angular/core';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ImageUploaderComponent, AddProductComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
