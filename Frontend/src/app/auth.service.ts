import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  loggedIn = false;
  type = '';

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn = !!localStorage.getItem('token'); // Check if token exists on initialization
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(tap(response => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('type', response.type);
        this.loggedIn = true;
        this.type = response.userType;
        this.router.navigate(['/recipe']);
      }})
    );
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registerUser`, user);
  }

  registerRestaurant(restaurant: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registerRestaurant`, restaurant);
  }

  logout(): Observable<any> {
    this.loggedIn = false;
    this.type = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('type');
    return this.http.get<any>(`${this.apiUrl}/logout`).pipe(
      finalize(() => {
        this.router.navigateByUrl('');
      })
    );
  }
}
