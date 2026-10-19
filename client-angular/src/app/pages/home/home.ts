import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: true,
  imports: [RouterLink]
})
export class HomeComponent implements OnInit {
  eventList: any[] = [];
  errorMsg: string | null = null;
  isLoading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("发起请求");
    this.isLoading = true;
    this.errorMsg = null; // 每次进入页面清空错误
    this.http.get<any>('http://localhost:3000/api/events').subscribe({
      next: (res) => {
        console.log("✅收到response", res);
        console.log("res.success =", res.success);
        console.log("res.data =", res.data);

        if (res.success) {
          this.eventList = res.data;
          this.errorMsg = null;
        } else {
          // ✅修复：后端返回success=false，把提示交给errorMsg
          this.errorMsg = res.message ?? 'Failed to fetch events from server';
          this.eventList = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌请求出错", err);
        this.errorMsg = "Network error: cannot connect to backend api";
        this.eventList = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    })
  }

  isUpcoming(dateStr:string):boolean{
    const eventDate = new Date(dateStr);
    const now = new Date();
    return eventDate > now;
  }
}
