/**
 * EventDetailComponent
 * This component renders a single charity event's full details page.
 * It displays event information, associated registration records and weather information.
 * It also provides an embedded modal dialog for users to submit event registration.
 * Route parameter: id — numeric unique identifier for target event resource
 */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetailComponent implements OnInit {
  // Holds complete data object of currently‑viewed event
  event: any = null;
  // Array storing all registration entries linked to the selected event
  registrations: any[] = [];
  // Global text message for page‑level loading or runtime errors
  errorMsg = '';

  // Boolean flag to control visibility of registration input modal
  showRegisterModal = false;
  // Boolean flag to toggle registration success feedback popup
  showSuccessPopup = false;
  // Boolean flag to toggle registration failure feedback popup
  showErrorPopup = false;
  // Custom error message text rendered inside the error popup component
  popupErrorMessage = '';

  // Two‑way bound input value: user full name inside registration modal
  registerName = '';
  // Two‑way bound input value: user email address inside registration modal
  registerEmail = '';

  // ========= Weather related component state variables =========
  // Stores response payload retrieved from backend weather proxy API
  weatherData: any = null;
  // Text message shown when weather data request encounters failure
  weatherError = '';

  constructor(
    private route: ActivatedRoute,       // Angular router utility, used to extract url path parameters
    private http: HttpClient,            // Angular built‑in http client for performing backend api requests
    private cdr: ChangeDetectorRef       // ChangeDetectorRef, manually trigger ui update for async data
  ) {}

  /**
   * ngOnInit
   * Angular lifecycle hook, executes automatically after component initialisation
   * Workflow:
   * 1. Parse numeric event id value from url route snapshot
   * 2. Send http GET request to fetch target event metadata plus registration list
   * 3. If valid latitude and longitude exist on event object, trigger weather data request
   * 4. Assign response data to component properties and trigger view refresh
   */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('路由拿到id:', id);
    this.http.get<{success:boolean, data:any, message?:string}>(`http://localhost:3000/api/events/${id}`)
    .subscribe({
      next: (res) => {
        console.log('后端返回 res:', res);
        if (!res.success) {
          this.errorMsg = res.message ?? 'Failed to load event';
          return;
        }
        this.event = res.data.event;
        this.registrations = res.data.registrations || [];
        console.log('赋值后的event:', this.event);
        // ✅ 使用 latitude longitude 加载天气
        if(this.event?.latitude != null && this.event?.longitude != null){
          this.loadWeather(this.event.latitude, this.event.longitude);
        }
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error('请求错误对象:', err);
        this.errorMsg = `Failed to load event`;
      }
    });
  }

  /**
   * loadWeather
   * Invoke backend weather proxy api endpoint with geographic coordinates
   * @param lat number — geographic latitude value of event location
   * @param lng number — geographic longitude value of event location
   */
  loadWeather(lat: number, lng: number) {
    this.http.get<any>(`http://localhost:3000/api/weather`, {
      params: { lat, lng }
    }).subscribe({
      next: (weatherRes) => {
        this.weatherData = weatherRes;
        this.weatherError = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.weatherData = null;
        this.weatherError = 'Cannot load weather data';
        this.cdr.markForCheck();
      }
    })
  }

  /**
   * openRegisterModal
   * Set boolean flag to true, makes registration input modal visible on webpage
   */
  openRegisterModal(){
    this.showRegisterModal = true;
  }

  /**
   * closeRegisterModal
   * Hide registration modal dialog and clear all form input field local variables
   */
  closeRegisterModal(){
    this.showRegisterModal = false;
    this.registerName = '';
    this.registerEmail = '';
  }

  /**
   * closeSuccessPopup
   * Hide the popup component which displays successful registration feedback
   */
  closeSuccessPopup(){
    this.showSuccessPopup = false;
  }

  /**
   * closeErrorPopup
   * Hide popup component used for showing registration failure messages
   */
  closeErrorPopup(){
    this.showErrorPopup = false;
  }

  /**
   * submitRegistration
   * Assemble form payload and send POST request to backend registration api
   * On api success: close modal, open success hint, refresh registration list display
   * On api business failure or network error: assign error text and open error popup
   */
  submitRegistration(){
    const payload = {
      event_id: this.event.event_id,
      name: this.registerName,
      email: this.registerEmail
    };
    this.http.post('http://localhost:3000/api/register', payload)
    .subscribe({
      next: (res:any)=>{
        console.log('报名接口返回：', res);
        if(res.success){
          this.closeRegisterModal();
          this.showSuccessPopup = true;
          this.refreshRegistrations();
        }else{
          this.popupErrorMessage = res.message ?? "Registration failed";
          this.showErrorPopup = true;
        }
      },
      error: (err)=>{
        console.error('完整错误对象：',err);
        this.popupErrorMessage = 'Registration failed, please try again.';
        this.showErrorPopup = true;
      }
    })
  }

  /**
   * refreshRegistrations
   * Re‑request event detail endpoint to obtain latest registration dataset
   * Invoked right after user submits a new registration form
   * NOTE: No fallback for null / undefined registrations value exists here
   */
  refreshRegistrations(){
    const id = this.event.event_id;
    this.http.get<{success:boolean, data:any}>(`http://localhost:3000/api/events/${id}`)
    .subscribe(res=>{
      if(res.success){
        this.registrations = res.data.registrations;
        this.cdr.markForCheck();
      }
    })
  }

  /**
   * getWeatherText
   * Utility helper method: convert numeric open‑meteo weather code to human‑readable string
   * Called from html template to render plain‑text weather description
   * @param code number — raw numeric weather code value obtained from open‑meteo api
   * @returns string human‑friendly weather condition description
   */
  getWeatherText(code: number): string {
    if (!code) return 'Unknown';
    if (code === 0) return 'Clear sky';
    if (code >=1 && code <=3) return 'Partly cloudy';
    if (code >=45 && code <=48) return 'Foggy';
    if (code >=51 && code <=57) return 'Drizzle';
    if (code >=61 && code <=67) return 'Rain';
    if (code >=71 && code <=77) return 'Snow';
    if (code >=80 && code <=82) return 'Rain showers';
    if (code >=85 && code <=86) return 'Snow showers';
    if (code >=95) return 'Thunderstorm';
    return 'Unknown weather';
  }
}
