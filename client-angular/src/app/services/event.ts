/**
 * EventService
 * Angular root service for all event‑related API calls.
 * Encapsulate http requests for categories, event search, single event and weather proxy.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventService {
  // Base backend api host address
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all event categories from backend
   * @returns Observable of http get response
   */
  getCategories() {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  /**
   * Filter events with query parameters (date, location, category_id)
   * @param params query filter object
   * @returns Observable of filtered event list
   */
  searchEvents(params: any) {
    return this.http.get<any>(`${this.apiUrl}/search-events`, { params });
  }

  /**
   * Get single event detail together with its registrations
   * @param id target event numeric id
   * @returns Observable containing event and registrations data
   */
  getEventById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  /**
   * Request weather proxy api
   * Note: current implementation expects "location" param, backend requires lat,lng instead
   * @param location location parameter string
   * @returns Observable of weather response
   */
  getWeather(location: string) {
    return this.http.get<any>(`${this.apiUrl}/weather`, {
      params: { location }
    });
  }
}
