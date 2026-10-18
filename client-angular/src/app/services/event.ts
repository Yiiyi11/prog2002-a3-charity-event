import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  searchEvents(params: any) {
    return this.http.get<any>(`${this.apiUrl}/search-events`, { params });
  }
}
