import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { Storage, UploadTask, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface Product {
  productName: string;
  categoryId: string; 
  productPrice: number;
  productPicture: string[]; 
  productColor: string;
  productDescription: string;
  productRate: number;
  productStock: number;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})


export class AddProductComponent {
  readonly APIUrl = "http://localhost:3000/api/product/create";

  isLoading = false;
  isUploading = false;
  showModal = false;
  imagePreviews: { file: File, url: string }[] = [];
  product: Product = {
    productName: '',
    categoryId: '',
    productPrice: 0,
    productPicture: [], // Initialize as an empty array
    productColor: '',
    productDescription: '',
    productRate: 0,
    productStock: 0
  };

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  openAddProductModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
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
          uploadTask.on('state_changed',
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
      console.log("All files uploaded successfully!");
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

    this.http.post(this.APIUrl, this.product)
      .subscribe((response: any) => {
        console.log('Product added successfully:', response);
        this.showSuccessMessage('Product added successfully!');
        this.closeModal();
      }, (error) => {
        console.error('Error adding product:', error);
        this.showErrorMessage('Failed to add product. Please try again.');
      })
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
          productStock: 0
        };
      });
  }
}