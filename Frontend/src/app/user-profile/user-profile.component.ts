import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = {};
  newUser: any = {};
  favoriteRecipes: any[] = [];
  errorMessage = '';
  userId = localStorage.getItem('userId');
  newDiploma: any = { name: '', content: '', date: '' };
  newExperience: any = { name: '', content: '', date: '' };

  constructor(public authService: AuthService, private recipeService: RecipeService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if(this.userId) {
      this.getById(this.userId);
      this.getFavoriteRecipes(this.userId);
    }
  }

  getFavoriteRecipes(userId: string): void {
    this.recipeService.getAllFavorites(userId).subscribe(
      (data) => {
        this.favoriteRecipes = data;
      },
      (error) => {
        console.error('Error fetching favorite recipes:', error);
        this.errorMessage = 'Failed to fetch favorite recipes.';
      }
    );
  }

  removeFromFavorites(recipeId: string): void {
    if (confirm('Are you sure you want to remove this recipe from favorites?')) {
      // @ts-ignore
      this.recipeService.deleteFavorite(this.userId, recipeId).subscribe(
        () => {
          console.log(`Recipe with ID ${recipeId} removed from favorites successfully.`);
          // @ts-ignore
          this.getFavoriteRecipes(this.userId);
        },
        (error) => {
          console.error(`Error removing recipe with ID ${recipeId} from favorites:`, error);
          this.errorMessage = 'Failed to remove recipe from favorites.';
        }
      );
    }
  }

  getAll(): void {
    this.userService.getAll().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to fetch users.';
      }
    );
  }

  addDiploma(): void {
    if (this.newDiploma) {
      const newDiploma = {
        name: this.newDiploma.name.trim(),
        content: this.newDiploma.content.trim(),
        date: this.newDiploma.date
      };
      if (!this.selectedUser.diplomas) {
        this.selectedUser.diplomas = [];
      }
      this.selectedUser.diplomas.push(newDiploma);
      this.newDiploma = { name: '', content: '', date: '' };
    }
  }

  removeDiploma(diploma: any): void {
    this.selectedUser.diplomas = this.selectedUser.diplomas.filter((d: any) => d !== diploma);
  }

  addExperience(): void {
    if (this.newExperience) {
      const newExperience = {
        name: this.newExperience.name.trim(),
        content: this.newExperience.content.trim(),
        date: this.newExperience.date
      };
      if (!this.selectedUser.experiences) {
        this.selectedUser.experiences = [];
      }
      this.selectedUser.experiences.push(newExperience);
      this.newExperience = { name: '', content: '', date: '' };
    }
  }

  removeExperience(experience: any): void {
    this.selectedUser.experiences = this.selectedUser.experiences.filter((d: any) => d !== experience);
  }

  getById(id: string): void {
    this.userService.getById(id).subscribe(
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
    this.userService.add(this.newUser).subscribe(
      (data) => {
        console.log('User added successfully:', data);
        this.newUser = {};
        this.getAll();
      },
      (error) => {
        console.error('Error adding user:', error);
        this.errorMessage = 'Failed to add user.';
      }
    );
  }

  update(): void {
    if (confirm('Are you sure you want to update?')) {
      this.userService.update(this.selectedUser).subscribe(
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
        this.userService.delete(this.userId).subscribe(
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
