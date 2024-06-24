import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
  users: any[] = [];
  selectedUser: any = {};
  newUser: any = {};
  favoriteRecipes: any[] = [];
  errorMessage = '';
  userId = localStorage.getItem('userId');
  type = localStorage.getItem('type');

  constructor(public authService: AuthService, private recipeService: RecipeService, private userService: UserService, private router: Router,private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.getFavoriteRecipes(this.userId);
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

  rate (recipeId: string){
    this.recipeService.rate(recipeId).subscribe(
      (response) => {
        console.log('Rate Updated:', response);
      },
      (error) => {
        console.error('Error adding to favorites:', error);
      }
    );
  }

  removeFromFavorites(recipeId: string): void {
    if (confirm('Are you sure you want to remove this recipe from favorites?')) {
      // @ts-ignore
      this.recipeService.deleteFavorite(this.userId, recipeId).subscribe(
        () => {
          console.log(`Recipe with ID ${recipeId} removed from favorites successfully.`);
          this.rate(recipeId);
          // @ts-ignore
          this.getFavoriteRecipes(this.userId);
        },
        (error) => {
          console.error(`Error removing recipe with ID ${recipeId} from favorites:`, error);
          this.errorMessage = 'Failed to remove recipe from favorites.';
        }
      );
      this.recipeService.rate(recipeId).subscribe(
        (response) => {
          console.log('Rate Updated:', response);
        },
        (error) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }

}
