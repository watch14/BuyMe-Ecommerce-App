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
    const updatedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      isAdmin: user.isAdmin // Update isAdmin based on local state
    };
  
    this.http.put<ApiResponse>(`${this.userApiUrl}/update/${user._id}`, updatedUser).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          // Update local user object with the updated data
          const index = this.users.findIndex(u => u._id === user._id);
          if (index !== -1) {
            this.users[index] = {
              ...response.data, // Ensure to spread response data
              editing: false,
              isAdmin: user.isAdmin // Update isAdmin based on local state
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

  deleteRole(user: User, roleId: string): void {
    user.roles = user.roles.filter(role => role !== roleId);
    this.saveUser(user);
  }

  addRole(user: User, roleId: string): void {
    if (!user.roles.includes(roleId)) {
      user.roles.push(roleId);
      this.saveUser(user);
    }
  }

  promoteToAdmin(user: User): void {
    // Check if user already has both roles
    if (!this.calculateIsAdmin(user.roles)) {
      // Add both roles to the user's roles array
      user.roles.push('6687caa842b33badb0a3aa49'); // Add User role
      user.roles.push('6687caae42b33badb0a3aa4b'); // Add Admin role
  
      // Update user's isAdmin flag locally
      user.isAdmin = true;
  
      // Save changes to the backend
      this.saveUser(user);
    }
  }
  

  demoteToUser(user: User): void {
    this.deleteRole(user, '6687caae42b33badb0a3aa4b');
  }

  calculateIsAdmin(roles: string[]): boolean {
    return roles.includes('6687caa842b33badb0a3aa49') && roles.includes('6687caae42b33badb0a3aa4b');
  }
}