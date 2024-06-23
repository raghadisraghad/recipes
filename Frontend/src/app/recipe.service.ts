import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recipe`, { headers: this.getHeaders() });
  }

  getAllFavorites(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites/${id}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipe/${id}`, { headers: this.getHeaders() });
  }

  add(newRecipe: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recipe`, newRecipe, { headers: this.getHeaders() });
  }

  rate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rate/${id}`, { headers: this.getHeaders() });
  }

  addFavorite(idUser: string,idRecipe: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites/${idUser}/${idRecipe}`, { headers: this.getHeaders() });
  }

  update(updatedRecipe: any): Observable<any> {
    const id = updatedRecipe._id;
    return this.http.put<any>(`${this.apiUrl}/recipe/${id}`, updatedRecipe, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/recipe/${id}`, { headers: this.getHeaders() });
  }

  deleteFavorite(idUser: string,idRecipe: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${idUser}/${idRecipe}`, { headers: this.getHeaders() });
  }
}
