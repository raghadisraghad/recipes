import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RequestComponent } from './request/request.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registerUser', component: RegisterUserComponent },
  { path: 'registerRestaurant', component: RegisterRestaurantComponent },
  { path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'requests', component: RequestComponent, canActivate: [AuthGuard] },
  { path: 'restaurantProfile', component: RestaurantProfileComponent, canActivate: [AuthGuard] },
  { path: 'recipe', component: RecipeComponent},
  { path: 'restaurant', component: RestaurantComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/recipe', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
