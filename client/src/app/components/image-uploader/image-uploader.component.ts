import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent {
  selectedFile: File | null = null;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile) {
      const filePath = `products/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.saveProductData(url);
          });
        })
      ).subscribe();
    }
  }

  saveProductData(imageUrl: string) {
    const productData = {
      productName: (document.getElementById('productName') as HTMLInputElement).value,
      categoryId: (document.getElementById('categoryId') as HTMLInputElement).value,
      productPrice: +((document.getElementById('productPrice') as HTMLInputElement).value),
      productColor: (document.getElementById('productColor') as HTMLInputElement).value || 'No Colors Option',
      productDescription: (document.getElementById('productDescription') as HTMLTextAreaElement).value,
      productRate: +((document.getElementById('productRate') as HTMLInputElement).value),
      productStock: +((document.getElementById('productStock') as HTMLInputElement).value),
      productDiscount: +((document.getElementById('productDiscount') as HTMLInputElement).value) || 0,
      productPicture: imageUrl,
    };

    this.db.list('/products').push(productData).then(() => {
      alert('Product Created Successfully!');
    }).catch((error) => {
      console.error('Error saving product data:', error);
      alert('Failed to create product. Please try again.');
    });
  }
}
