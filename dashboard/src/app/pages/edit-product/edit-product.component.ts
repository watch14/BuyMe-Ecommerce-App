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
  editProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editProductForm = this.fb.group({
      productName: [data.productName, Validators.required],
      productPrice: [data.productPrice, [Validators.required, Validators.min(0)]],
      productCategory: [data.productCategory, Validators.required],
      productImage: [null]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.editProductForm.patchValue({
      productImage: file
    });
  }

  save() {
    if (this.editProductForm.valid) {
      this.dialogRef.close(this.editProductForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}