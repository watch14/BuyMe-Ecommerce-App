import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { Storage, UploadTask, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})


export class ImageUploaderComponent {
  private storage = inject(Storage);
  uploadedImageUrls: string[] = [];
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
    this.uploadedImageUrls = []; // Clear previous uploaded URLs

    for (let preview of this.imagePreviews) {
      const file = preview.file;
      const storageRef = ref(this.storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTasks.push(
        new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot: UploadTaskSnapshot) => {
              // Handle progress, if needed
            },
            (error) => {
              console.error('Error uploading file:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File uploaded. Download URL:", downloadURL);
              this.uploadedImageUrls.push(downloadURL); // Store the download URL
              resolve();
            }
          );
        })
      );
    }

    try {
      await Promise.all(uploadTasks);
      console.log("All files uploaded successfully!");
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle error appropriately (e.g., show error message)
    }

    // Clear image previews after upload
    this.imagePreviews = [];
  }
}