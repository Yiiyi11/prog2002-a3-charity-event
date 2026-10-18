import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private baseUrl = 'http://localhost:3000/api/events';
  private categoryUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.categoryUrl);
  }

  searchEvents(filters: { date?: string; location?: string; category_id?: string }): Observable<any> {
    let params = new HttpParams();
    if (filters.date) params = params.set('date', filters.date);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.category_id) params = params.set('category_id', filters.category_id);
    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }
}
