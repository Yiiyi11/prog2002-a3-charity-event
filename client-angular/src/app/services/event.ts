import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvent(id: number) {
    return this.http.get<{success: boolean; data: any; message?: string}>(`http://localhost:3000/api/events/${id}`);
  }

  getCategories() {
    return this.http.get<{success: boolean; data: any[]; message?: string}>('http://localhost:3000/api/categories');
  }

  searchEvents(queryObj: any) {
    return this.http.post<{success: boolean; data: any[]; message?: string}>('http://localhost:3000/api/events/search', queryObj);
  }
}
