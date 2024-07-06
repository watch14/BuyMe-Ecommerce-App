import { Component, inject} from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent {
  private storage = inject(Storage);

  async uploadFile(input: HTMLInputElement) {
    console.log("aaaaaa")
    if (!input.files) return

    const files: FileList = input.files;
    console.log(files)
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const storageRef = ref(this.storage, file.name);
          const uploadTask = uploadBytesResumable(storageRef, file);

          // Wait for the upload to complete and get the download URL
          const snapshot = await uploadTask;
          const downloadURL = await getDownloadURL(snapshot.ref);

          console.log("File uploaded. Download URL:", downloadURL);
      }
    }
  }

}

