import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ApiResponse {
  response: User;
  success: boolean;
  status: number;
  message: string;
  data: User;
}

interface User {
  map(arg0: (user: any) => any): User[];
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isAdmin: boolean;
  editing: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userCount: number = 0;
  users: User[] = [];
  private userApiUrl = 'http://localhost:3000/api/user';
  showUsers: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.http.get<ApiResponse>(this.userApiUrl).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.users = response.data.map(user => ({
            ...user,
            editing: false,
            isAdmin: this.calculateIsAdmin(user.roles)
          }));
          this.userCount = this.users.length;
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  saveUser(user: User): void {
    // Ensure isAdmin is correctly set based on roles
    const isAdmin = this.calculateIsAdmin(user.roles);

    const updatedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: isAdmin ? ['6687caa842b33badb0a3aa49', '6687caae42b33badb0a3aa4b'] : ['6687caa842b33badb0a3aa49'],
      isAdmin: isAdmin
    };

    this.http.put<ApiResponse>(`${this.userApiUrl}/update/${user._id}`, updatedUser).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          // Update local user object with the updated data
          const index = this.users.findIndex(u => u._id === user._id);
          if (index !== -1) {
            this.users[index] = {
              ...response.data, // Spread response data
              editing: false,
              isAdmin: this.calculateIsAdmin(response.data.roles)
            };
          }
          console.log('User updated successfully:', response.data);
        } else {
          console.error('Error updating user:', response.message);
        }
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  toggleUserList(): void {
    this.showUsers = !this.showUsers;
  }

  editUser(user: User): void {
    user.editing = !user.editing;
  }

  promoteToAdmin(user: User): void {
    // Ensure both roles are present for an admin
    user.roles = ['6687caa842b33badb0a3aa49', '6687caae42b33badb0a3aa4b'];

    // Update user's isAdmin flag locally
    user.isAdmin = true;

    // Save changes to the backend
    this.saveUser(user);
  }

  demoteToUser(user: User): void {
    // Only keep the User role
    user.roles = ['6687caa842b33badb0a3aa49'];

    // Update user's isAdmin flag locally
    user.isAdmin = false;

    // Save changes to the backend
    this.saveUser(user);
  }

  calculateIsAdmin(roles: string[]): boolean {
    return roles.includes('6687caae42b33badb0a3aa4b');
  }
}
