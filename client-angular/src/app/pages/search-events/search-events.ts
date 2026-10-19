import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event';
@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-events.html',
})
export class SearchEventsComponent implements OnInit {
  searchForm: FormGroup;
  categories: any[] = [];
  results: any[] = [];
  errorMsg = '';
  constructor(private fb: FormBuilder, private eventSvc: EventService) {
    this.searchForm = this.fb.group({
      date: [''],
      location: [''],
      category_id: ['']
    });
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.eventSvc.getCategories().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.categories = res.data ?? [];
        } else {
          this.categories = [];
        }
      },
      error: () => {
        this.errorMsg = 'Cannot load categories from server';
        this.categories = [];
      }
    });
  }
  onSearch(): void {
    console.log("=== 点击Search ===");
    this.errorMsg = '';
    const f = this.searchForm.value;
    console.log("表单原始值：", f);
    // 构造参数，category_id转数字
    const params: any = {};
    if (f.date) params.date = f.date;
    if (f.location) params.location = f.location.trim();
    if (f.category_id) params.category_id = Number(f.category_id);
    console.log("传给后端参数：", params);
    this.eventSvc.searchEvents(params).subscribe({
      next: (res: any) => {
        console.log("后端完整返回：", res);
        if (!res.success) {
          this.errorMsg = res.message ?? 'Search failed';
          this.results = [];
          return;
        }
        if (res.count === 0) {
          this.errorMsg = 'No matching events found.';
          this.results = [];
          return;
        }
        this.results = [...res.data];
        console.log("渲染用的results数组：", this.results);
      },
      error: (err: any) => {
        console.error("请求报错：", err);
        this.errorMsg = `Search error: ${err.error?.message || err.message}`;
      }
    });
  }
  clearFilters(): void {
    this.searchForm.reset({ date: '', location: '', category_id: '' });
    this.results = [];
    this.errorMsg = '';
  }
}
