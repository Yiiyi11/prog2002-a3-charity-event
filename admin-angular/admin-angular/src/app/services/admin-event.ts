import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
/**
 * Admin service for event CRUD
 */
@Injectable({providedIn:'root'})
export class AdminEventService{
  baseUrl = "http://localhost:3000/api";
  constructor(private http:HttpClient){}
  getAllEvents():Observable<any>{
    return this.http.get(`${this.baseUrl}/events`)
  }
  createEvent(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/events`,data);
  }
  updateEvent(id:number,data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/events/${id}`,data);
  }
  deleteEvent(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/events/${id}`);
  }
  getSingleEvent(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/events/${id}`);
  }
}
