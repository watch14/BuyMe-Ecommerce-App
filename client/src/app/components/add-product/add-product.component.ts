import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { Storage, UploadTask, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


interface Product {
  productName: string;
  categoryId: string; // Replace with appropriate type
  productPrice: number;
  productPicture: string[]; // Array to store image URLs
  productColor: string;
  productDescription: string;
  productRate: number;
  productStock: number;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})


export class AddProductComponent {
  readonly APIUrl = "http://localhost:3000/api/product/create";

  // Inject storage and HTTP client
  constructor(private storage: Storage, private http: HttpClient) {}
  uploadedImageUrls: string[] = [];
  // Product data model
  product: Product = {
    productName: '',
    categoryId: '',
    productPrice: 0,
    productPicture: [],
    productColor: '',
    productDescription: '',
    productRate: 0,
    productStock: 0
  };

  imagePreviews: { file: File, url: string }[] = [];

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
              console.log("File uploaded. Download URL:", downloadURL);
              this.product.productPicture.push(downloadURL); // Store the download URL in product model
              resolve();
            }
          );
        })
      );
    }
  
    try {
      await Promise.all(uploadTasks);
      console.log("All files uploaded successfully!");
  
      // After uploading images and getting URLs, call function to add product
      this.addProduct();
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle error appropriately (e.g., show error message)
    }
  
    // Clear image previews after upload
    this.imagePreviews = [];
  }
  addProduct() {
    // Assuming you have HttpClient imported and injected

    this.http.post(this.APIUrl, this.product)
      .subscribe((response) => {
        console.log('Product added successfully:', response);
        // Optionally reset form or handle success message
      }, (error) => {
        console.error('Error adding product:', error);
        // Handle error (e.g., show error message)
      });
  }
}