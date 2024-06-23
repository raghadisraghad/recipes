import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-restaurant',
  templateUrl: './register-restaurant.component.html',
  styleUrls: ['./register-restaurant.component.css']
})
export class RegisterRestaurantComponent {
  name = '';
  password = '';
  email = '';
  phone = 0;
  picture = '';
  description = '';
  errorMessage = '';
  token = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    let registerData: any = {
      name: this.name,
      password: this.password,
      email: this.email,
      phone: this.phone,
      picture: this.picture,
      description: this.description
    };

    this.authService.registerRestaurant(registerData).subscribe(
      (response) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
