import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any;
}

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
  newProductForm: FormGroup;
  private createProductApiUrl = 'http://localhost:3000/api/product/create';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.newProductForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productCategory: ['', Validators.required],
      productColor: ['', Validators.required],
      productDescription: ['', Validators.required],
      productRate: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      productStock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  submit(): void {
    if (!this.newProductForm.valid) return;

    const newProduct = {
      productName: this.newProductForm.get('productName')?.value,
      productPrice: this.newProductForm.get('productPrice')?.value,
      categoryId: this.newProductForm.get('productCategory')?.value,
      productColor: this.newProductForm.get('productColor')?.value,
      productDescription: this.newProductForm.get('productDescription')?.value,
      productRate: this.newProductForm.get('productRate')?.value,
      productStock: this.newProductForm.get('productStock')?.value,
      productPicture: [] // Skipping for now
    };

    this.http.post<ApiResponse>(this.createProductApiUrl, newProduct).subscribe(
      (response) => {
        if (response.success) {
          // Navigate to the product list or success page
          this.router.navigate(['/products']);
        }
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }
}
