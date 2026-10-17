import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private baseUrl = 'http://localhost:8090/api/registrations';
  constructor(private http: HttpClient) {}

  createRegistration(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
}
