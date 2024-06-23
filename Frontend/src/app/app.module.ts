import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RecipeComponent } from './recipe/recipe.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import {AuthGuard} from "./auth.guard";
import { HttpClientModule } from '@angular/common/http';
import {AuthService} from "./auth.service";
import { RequestComponent } from './request/request.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantComponent,
    RecipeComponent,
    LoginComponent,
    RegisterUserComponent,
    RegisterRestaurantComponent,
    UserProfileComponent,
    RestaurantProfileComponent,
    RequestComponent,
    FavoritesComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
