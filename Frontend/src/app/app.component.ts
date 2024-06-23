import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Recipes';
  type = localStorage.getItem('type');

  constructor(public authService: AuthService, private router: Router) {}

  getProfileRoute():void {
    if (this.type === 'user') {
      this.router.navigateByUrl('/userProfile');
    } else if (this.type === 'restaurant') {
      this.router.navigateByUrl('/restaurantProfile');
    } else {
      this.router.navigateByUrl('');
    }
  }
  onLogoutConfirmed() {
    if (confirm('Are you sure you want to logout ?')) {
      this.authService.logout(); // Call logout method if confirmed
    }
  }
}
