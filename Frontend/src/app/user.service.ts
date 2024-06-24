import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  add(newRecipe: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, newRecipe, { headers: this.getHeaders() });
  }

  // rate(id: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/rate/${id}`, { headers: this.getHeaders() });
  // }

  update(updatedRecipe: any): Observable<any> {
    const id = updatedRecipe._id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedRecipe, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
