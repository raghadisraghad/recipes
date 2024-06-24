import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { RestaurantService } from '../restaurant.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipes: any[] = [];
  showAddForm: boolean = false;
  newRecipe: any = {
    userId: { id: '', name: '' },
    name: '',
    ingredients: [],
    description: '',
    picture: '',
    rate: 0
  };
  newIngredient: any = { name: '', gram: '' };
  ingredientName: string = '';
  ingredientGram: string = '';
  userId = localStorage.getItem('userId');
  type = localStorage.getItem('type');
  userName = localStorage.getItem('userName');
  favorites: any[] = [];

  constructor(private recipeService: RecipeService,private restaurantService: RestaurantService,private userService: UserService) { }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadFavorites();
  }

  loadRecipes() {
    this.recipeService.getAll().subscribe(
      (recipes) => {
        this.recipes = recipes;
      },
      (error) => {
        console.error('Error loading recipes:', error);
      }
    );
  }

  loadFavorites() {
    if (this.userId) {
      this.recipeService.getAllFavorites(this.userId).subscribe(
        (favorites) => {
          this.favorites = favorites.map(fav => fav._id);
        },
        (error) => {
          console.error('Error loading favorites:', error);
        }
      );
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.newRecipe = {
      userId: { id: '', name: '' },
      name: '',
      ingredients: [],
      description: '',
      picture: '',
      rate: 0
    };
  }

  addIngredient() {
    const newIngredient = { name: this.ingredientName, gram: this.ingredientGram };
    this.newRecipe.ingredients.push(newIngredient);
    this.ingredientName = '';
    this.ingredientGram = '';
  }

  addNewIngredient(recipe: any) {
    recipe.ingredients.push({ name: this.newIngredient.name, gram: this.newIngredient.gram });
    this.newIngredient = { name: '', gram: '' };
  }

  removeIngredient(index: number) {
    this.newRecipe.ingredients.splice(index, 1);
  }

  removeExistingIngredient(recipe: any, index: number) {
    recipe.ingredients.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.newRecipe.picture = file;
  }

  onSubmit() {
    let recipe = {
      userId: { id: this.userId, name: this.userName },
      name: this.newRecipe.name,
      ingredients: this.newRecipe.ingredients,
      description: this.newRecipe.description,
      picture: this.newRecipe.picture,
      rate: 0
    };
    this.recipeService.add(recipe).subscribe(
      (response) => {
        console.log('Recipe added successfully:', response);
        this.toggleAddForm();
        this.loadRecipes();
        this.showAddForm = false;
      },
      (error) => {
        console.error('Error adding recipe:', error);
      }
    );
  }

  deleteRecipe(recipeId: string) {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.delete(recipeId).subscribe(
        (response) => {
          console.log('Recipe deleted successfully:', response);
          // Reload recipes after deletion
          this.loadRecipes();
        },
        (error) => {
          console.error('Error deleting recipe:', error);
        }
      );
    }
  }

  update(recipe: any) {
    if (confirm('Are you sure you want to update this recipe?')) {
      let updatedRecipe = {
        _id: recipe._id,
        userId: { id: this.userId, name: this.userName },
        name: recipe.name,
        ingredients: recipe.ingredients,
        description: recipe.description,
        picture: recipe.picture,
        rate: recipe.rate
      };

      this.recipeService.update(updatedRecipe).subscribe(
        (response) => {
          console.log('Recipe updated successfully:', response);
          this.loadRecipes();
        },
        (error) => {
          console.error('Error updating recipe:', error);
        }
      );
    }
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

  addFavorite(recipeId: string) {
    if (this.userId) {
      this.recipeService.addFavorite(this.userId, recipeId).subscribe(
        (response) => {
          console.log('Added to favorites:', response);
          this.loadFavorites();
          this.rate(recipeId);
          alert('Added to favorites successfully!');
        },
        (error) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }

  removeFavorite(recipeId: string) {
    if (this.userId) {
      this.recipeService.deleteFavorite(this.userId, recipeId).subscribe(
        (response) => {
          console.log('Removed from favorites:', response);
          this.loadFavorites();
          this.rate(recipeId);
          alert('Removed to favorites successfully!');
        },
        (error) => {
          console.error('Error removing from favorites:', error);
        }
      );
    }
  }

  isFavorite(recipeId: string): boolean {
    return this.favorites.includes(recipeId);
  }
}
