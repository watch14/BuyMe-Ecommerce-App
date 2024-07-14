import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {
  Storage,
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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

interface Producte {
  productName: string;
  categoryId: string;
  productPrice: number;
  productPicture: string[];
  productColor: string;
  productDescription: string;
  productRate: number;
  productStock: number;
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
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  editingProduct: Product | null = null;
  editProductForm: FormGroup;
  private productApiUrl =
    'http://localhost:3000/api/product/search?skip=0&take=100';
  private updateProductApiUrl = 'http://localhost:3000/api/product';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private storage: Storage,
    private snackBar: MatSnackBar
  ) {
    this.editProductForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      productColor: ['', Validators.required],
      productDescription: ['', Validators.required],
      productRate: ['', Validators.required],
      productStock: ['', Validators.required],
    });
  }

  readonly APIUrl = 'http://localhost:3000/api/product/create';

  isLoading = false;
  isUploading = false;
  showModal = false;
  showEditModal = false;
  imagePreviews: { file: File; url: string }[] = [];
  product: Producte = {
    productName: '',
    categoryId: '',
    productPrice: 0,
    productPicture: [], // Initialize as an empty array
    productColor: '',
    productDescription: '',
    productRate: 0,
    productStock: 0,
  };

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<ApiResponse>(this.productApiUrl).subscribe(
      (response) => {
        if (response.success) {
          this.products = Array.isArray(response.data)
            ? response.data
            : [response.data];
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  openAddProductModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  startEditProduct(product: Product): void {
    this.editingProduct = product;
    this.editProductForm.patchValue({
      productName: product.productName,
      productPrice: product.productPrice,
      categoryId: product.categoryId,
      productColor: product.productColor,
      productDescription: product.productDescription,
      productRate: product.productRate,
      productStock: product.productStock,
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingProduct = null;
  }

  saveEditedProduct() {
    if (!this.editProductForm.valid || !this.editingProduct) return;

    const updatedProduct: Product = {
      ...this.editingProduct,
      ...this.editProductForm.value,
    };

    this.http
      .put<ApiResponse>(`${this.updateProductApiUrl}/${updatedProduct._id}`, updatedProduct)
      .subscribe(
        (response) => {
          if (response.success) {
            const updatedProduct = response.data as Product;
            const index = this.products.findIndex(
              (p) => p._id === updatedProduct._id
            );
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.showSuccessMessage('Product updated successfully!');
            this.closeEditModal();
          }
        },
        (error) => {
          console.error('Error updating product:', error);
          this.showErrorMessage('Failed to update product. Please try again.');
        }
      );
  }

  deleteProduct(productId: string): void {
    this.http
      .delete<ApiResponse>(`${this.updateProductApiUrl}/${productId}`)
      .subscribe(
        (response) => {
          if (response.success) {
            this.products = this.products.filter(
              (product) => product._id !== productId
            );
            this.showSuccessMessage('Product deleted successfully!');
          }
        },
        (error) => {
          console.error('Error deleting product:', error);
          this.showErrorMessage('Failed to delete product. Please try again.');
        }
      );
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            this.imagePreviews.push({ file, url: e.target.result });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
  }

  async uploadFiles() {
    if (this.imagePreviews.length === 0) return;

    this.isUploading = true;

    const uploadTasks: Promise<void>[] = [];

    for (let preview of this.imagePreviews) {
      const file = preview.file;
      const storageRef = ref(this.storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTasks.push(
        new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Handle progress if needed
            },
            (error) => {
              console.error('Error uploading file:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              this.product.productPicture.push(downloadURL);
              resolve();
            }
          );
        })
      );
    }

    try {
      await Promise.all(uploadTasks);
      console.log('All files uploaded successfully!');
      this.addProduct();
    } catch (error) {
      console.error('Error uploading files:', error);
      this.showErrorMessage('Error uploading files. Please try again.');
    }

    this.isUploading = false;
    this.imagePreviews = [];
  }

  addProduct() {
    this.isLoading = true;

    this.http
      .post(this.APIUrl, this.product)
      .subscribe(
        (response: any) => {
          console.log('Product added successfully:', response);
          this.showSuccessMessage('Product added successfully!');
          this.closeModal();
          this.fetchProducts(); // Refresh the product list after adding a new product
        },
        (error) => {
          console.error('Error adding product:', error);
          this.showErrorMessage('Failed to add product. Please try again.');
        }
      )
      .add(() => {
        this.isLoading = false;
        // Optionally clear form fields or reset product data
        this.product = {
          productName: '',
          categoryId: '',
          productPrice: 0,
          productPicture: [],
          productColor: '',
          productDescription: '',
          productRate: 0,
          productStock: 0,
        };
      });
  }

  showSuccessMessage(message: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['snackbar-success', 'larger-snack-bar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, 'Close', config);
  }

  showErrorMessage(message: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['snackbar-error', 'larger-snack-bar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, 'Close', config);
  }
}