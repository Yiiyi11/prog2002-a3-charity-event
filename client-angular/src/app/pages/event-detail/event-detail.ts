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
  event: any = null;
  registrations: any[] = [];
  errorMsg = '';
  showRegisterModal = false;
  showSuccessPopup = false;
  showErrorPopup = false;
  popupErrorMessage = '';
  registerName = '';
  registerEmail = '';
  // ========= 新增天气变量 =========
  weatherData: any = null;
  weatherError = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
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
  // ========== 新增加载天气方法 (改成lat,lng参数) ==========
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
  openRegisterModal(){
    this.showRegisterModal = true;
  }
  closeRegisterModal(){
    this.showRegisterModal = false;
    this.registerName = '';
    this.registerEmail = '';
  }
  closeSuccessPopup(){
    this.showSuccessPopup = false;
  }
  closeErrorPopup(){
    this.showErrorPopup = false;
  }
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

  // 天气代码转文字描述（给html页面调用）
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
