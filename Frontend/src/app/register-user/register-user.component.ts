import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  firstName = '';
  lastName = '';
  username = '';
  password = '';
  email = '';
  phone = 0;
  picture = '';
  description = '';

  errorMessage = '';
  token = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    let registerData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone,
      picture: this.picture,
      description: this.description
    };

    this.authService.registerUser(registerData).subscribe(
      (response: any) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error.message;
      });
  }
}
