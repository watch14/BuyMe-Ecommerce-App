import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  categoryId: string;
  productPicture: string[];
  productColor: string;
  productDescription: string;
  productRate: number;
  productStock: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Product | Product[];
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  editingProduct: Product | null = null;
  editProductForm: FormGroup;
  private productApiUrl = 'http://localhost:3000/api/product/search?skip=0&take=100';
  private updateProductApiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.editProductForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productCategory: ['', Validators.required],
      productRate: ['', Validators.required] // Add productRate field to form
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<ApiResponse>(this.productApiUrl).subscribe(
      (response) => {
        if (response.success) {
          this.products = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  startEditProduct(product: Product): void {
    this.editingProduct = product;
    this.editProductForm.patchValue({
      productName: product.productName,
      productPrice: product.productPrice,
      productCategory: product.categoryId,
      productRate: product.productRate // Update form with product rate
    });
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.editProductForm.reset();
  }

  save(): void {
    if (!this.editProductForm.valid) return;

    const updatedProduct: Product = {
      _id: this.editingProduct?._id || '',
      productName: this.editProductForm.get('productName')?.value,
      productPrice: this.editProductForm.get('productPrice')?.value,
      categoryId: this.editProductForm.get('productCategory')?.value,
      productPicture: this.editingProduct?.productPicture || [],
      productColor: this.editingProduct?.productColor || '',
      productDescription: this.editingProduct?.productDescription || '',
      productRate: this.editProductForm.get('productRate')?.value, // Update product rate
      productStock: this.editingProduct?.productStock || 0,
      createdAt: this.editingProduct?.createdAt || '',
      updatedAt: this.editingProduct?.updatedAt || '',
      __v: this.editingProduct?.__v || 0
    };

    const productId = updatedProduct._id;

    if (!productId) return; // Ensure productId exists

    this.http.put<ApiResponse>(`${this.updateProductApiUrl}/${productId}`, updatedProduct).subscribe(
      (response) => {
        if (response.success) {
          const updatedProduct = response.data as Product;
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
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
    this.http.delete<ApiResponse>(`${this.updateProductApiUrl}/${productId}`).subscribe(
      (response) => {
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
