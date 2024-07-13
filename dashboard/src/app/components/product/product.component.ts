import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any[];
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  editingProduct: any = null;
  editProductForm: FormGroup;
  private productApiUrl = 'http://localhost:3000/api/product/search';
  private updateProductApiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient, private fb: FormBuilder, private dialog: MatDialog) {
    this.editProductForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productCategory: ['', Validators.required],
      productImage: [null]
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<ApiResponse>(this.productApiUrl).subscribe(
      (response) => {
        if (response.success) {
          this.products = response.data;
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  startEditProduct(product: any): void {
    this.editingProduct = product;
    this.editProductForm.patchValue({
      productName: product.productName,
      productPrice: product.productPrice,
      productCategory: product.productCategory,
      productImage: null
    });
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.editProductForm.reset();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editProductForm.patchValue({
        productImage: file
      });
    }
  }

  save(): void {
    if (!this.editProductForm.valid) return;

    const formData = new FormData();
    formData.append('productName', this.editProductForm.get('productName')?.value);
    formData.append('productPrice', this.editProductForm.get('productPrice')?.value);
    formData.append('productCategory', this.editProductForm.get('productCategory')?.value);
    if (this.editProductForm.get('productImage')?.value) {
      formData.append('productImage', this.editProductForm.get('productImage')?.value);
    }

    const productId = this.editingProduct._id;

    this.http.put(`${this.updateProductApiUrl}/${productId}`, formData).subscribe(
      (response: any) => {
        if (response.success) {
          const index = this.products.findIndex(p => p._id === productId);
          if (index !== -1) {
            this.products[index] = response.data;
          }
          this.cancelEdit();
        }
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

  deleteProduct(productId: string): void {
    this.http.delete(`${this.updateProductApiUrl}/${productId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.products = this.products.filter(product => product._id !== productId);
        }
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }
}
