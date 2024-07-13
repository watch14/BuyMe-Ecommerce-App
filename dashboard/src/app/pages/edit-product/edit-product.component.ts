import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  editProductForm!: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm(); // Initialize form controls
    this.fetchCategories(); // Fetch categories on component initialization
  }

  initForm() {
    this.editProductForm = this.fb.group({
      productName: [this.data?.productName || '', Validators.required],
      productPrice: [this.data?.productPrice || '', [Validators.required, Validators.min(0)]],
      productCategory: [this.data?.productCategory?._id || '', Validators.required],
      productImage: [null]
    });
  }

  fetchCategories() {
    this.http.get<any>('http://localhost:3000/api/category/').subscribe(
      response => {
        console.log('Categories API Response:', response); // Log the response to inspect its structure
        this.categories = response.data; // Assigning categories array from API response's data field
      },
      error => {
        console.error('Error fetching categories: ', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.editProductForm.patchValue({
      productImage: file
    });
  }

  save() {
    if (this.editProductForm.valid) {
      const productId = this.data._id; // Assuming your product data has an '_id' field
      const updatedProduct = this.editProductForm.value;
  
      // Prepare form data to send file along with other form fields
      const formData = new FormData();
      formData.append('productName', updatedProduct.productName);
      formData.append('productPrice', updatedProduct.productPrice.toString()); // Ensure productPrice is a string
      formData.append('productCategory', updatedProduct.productCategory);
      if (updatedProduct.productImage) {
        formData.append('productImage', updatedProduct.productImage);
      }
  
      // Send PUT request to update product
      this.http.put<any>(`http://localhost:3000/api/product/${productId}`, formData).subscribe(
        response => {
          console.log('Product updated successfully:', response);
          this.dialogRef.close(response); // Close dialog with updated product data
        },
        error => {
          console.error('Error updating product:', error);
          // Handle error as needed
          if (error.status === 404) {
            console.error('Product not found.');
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
    }
  }  

  close() {
    this.dialogRef.close();
  }
}