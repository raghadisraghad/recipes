import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/request`, { headers: this.getHeaders() });
  }

  getAllRestaurantsRequests(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requestRestaurant/${id}`, { headers: this.getHeaders() });
  }

  getAllUsersRequests(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requestUser/${id}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/request/${id}`, { headers: this.getHeaders() });
  }

  add(newRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request`, newRequest, { headers: this.getHeaders() });
  }

  update(updatedRequest: any): Observable<any> {
    const id = updatedRequest._id;
    return this.http.put<any>(`${this.apiUrl}/request/${id}`, updatedRequest, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/request/${id}`, { headers: this.getHeaders() });
  }
}
