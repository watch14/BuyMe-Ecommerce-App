import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userCount: number = 0;
  users: any[] = [];
  products: any[] = [];
  showUsers: boolean = false;
  private userApiUrl = 'http://localhost:3000/api/user';
  private productApiUrl = 'http://localhost:3000/api/product/search';

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.data;
          this.userCount = this.users.length;
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getAllUsers() {
    return this.http.get<ApiResponse>(this.userApiUrl);
  }

  toggleUserList(): void {
    this.showUsers = !this.showUsers;
  }

  editUser(user: any): void {
    console.log('Edit user:', user);
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.userApiUrl}/${userId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.users = this.users.filter(user => user._id !== userId);
          this.userCount = this.users.length;
        }
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
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

  editProduct(product: any): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the product in the backend
        const formData = new FormData();
        formData.append('productName', result.productName);
        formData.append('productPrice', result.productPrice);
        formData.append('productCategory', result.productCategory);
        if (result.productImage) {
          formData.append('productImage', result.productImage);
        }

        this.http.put(`${this.productApiUrl}/${product._id}`, formData).subscribe(
          (response: any) => {
            if (response.success) {
              // Update the local product list
              const index = this.products.findIndex(p => p._id === product._id);
              if (index !== -1) {
                this.products[index] = response.data;
              }
            }
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
      }
    });
  }

  deleteProduct(productId: string): void {
    this.http.delete(`${this.productApiUrl}/${productId}`).subscribe(
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