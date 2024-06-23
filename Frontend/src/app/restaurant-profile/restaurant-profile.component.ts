import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { RecipeService } from '../recipe.service';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.css']
})
export class RestaurantProfileComponent implements OnInit {

  users: any[] = [];
  selectedUser: any = {};
  newUser: any = {};
  errorMessage = '';
  userId = localStorage.getItem('userId');

  constructor(public authService: AuthService, private recipeService: RecipeService, private restaurantService: RestaurantService, private router: Router) { }

  ngOnInit(): void {
    if (this.userId) {
      this.getById(this.userId);
    }
  }

  getAll(): void {
    this.restaurantService.getAll().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to fetch users.';
      }
    );
  }

  getById(id: string): void {
    this.restaurantService.getById(id).subscribe(
      (data) => {
        this.selectedUser = data;
      },
      (error) => {
        console.error(`Error fetching user with ID ${id}:`, error);
        this.errorMessage = 'Failed to fetch user details.';
      }
    );
  }
  add(): void {
    this.restaurantService.add(this.newUser).subscribe(
      (data) => {
        console.log('User added successfully:', data);
        this.newUser = {};
        this.getAll(); // Refresh the list of users
      },
      (error) => {
        console.error('Error adding user:', error);
        this.errorMessage = 'Failed to add user.';
      }
    );
  }

  update(): void {
    if (confirm('Are you sure you want to update?')) {
      this.restaurantService.update(this.selectedUser).subscribe(
        (data) => {
          console.log('User updated successfully:', data);
          this.selectedUser = data;
          window.location.reload();
        },
        (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Failed to update user.';
        }
      );
    }
  }

  delete(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (this.userId) {
        this.restaurantService.delete(this.userId).subscribe(
          () => {
            console.log(`User with ID ${this.userId} deleted successfully.`);
            this.authService.logout().subscribe(
              () => {
                console.log('User logged out successfully.');
                // Optionally navigate to another page after logout
              },
              (logoutError) => {
                console.error('Error logging out:', logoutError);
                this.errorMessage = 'Failed to logout after deletion.';
              }
            );
          },
          (error) => {
            console.error(`Error deleting user with ID ${this.userId}:`, error);
            this.errorMessage = 'Failed to delete user.';
          }
        );
      } else {
        console.error('User ID is null or undefined.');
      }
    }
  }

}
