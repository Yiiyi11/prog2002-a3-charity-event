import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  // 新增：获取全部活动列表
  getEvents() {
    return this.http.get<any>(`${this.apiUrl}/events`);
  }

  getCategories() {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
  searchEvents(params: any) {
    return this.http.get<any>(`${this.apiUrl}/search-events`, { params });
  }
  getEventById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }
  getWeather(location: string) {
    return this.http.get<any>(`${this.apiUrl}/weather`, {
      params: { location }
    });
  }
}
