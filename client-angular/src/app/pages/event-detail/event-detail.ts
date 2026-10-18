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
  showErrorPopup = false; // 新增：自定义错误弹窗
  popupErrorMessage = ''; // 存放错误文字

  registerName = '';
  registerEmail = '';
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
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error('请求错误对象:', err);
        this.errorMsg = `Failed to load event`;
      }
    });
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
          // 不使用alert，改用自定义弹窗
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
}
