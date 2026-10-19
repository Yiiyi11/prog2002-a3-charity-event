/**
 * SearchEventsComponent
 * This component implements the event search and filtering page.
 * Users can filter charity events by date, location and category.
 * It loads category options and sends filter parameters to backend API.
 */
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
  // Reactive form group for search filter inputs
  searchForm: FormGroup;
  // List of event categories loaded from backend
  categories: any[] = [];
  // Array to hold filtered event search results
  results: any[] = [];
  // Error message shown on page for failed requests or empty search result
  errorMsg = '';

  constructor(private fb: FormBuilder, private eventSvc: EventService) {
    // Initialize reactive form with three filter fields
    this.searchForm = this.fb.group({
      date: [''],
      location: [''],
      category_id: ['']
    });
  }

  /**
   * Angular lifecycle hook, runs once when component initializes
   * Load category dropdown options on page startup
   */
  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Fetch all event categories from backend API
   * Populate categories array or handle network error
   */
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

  /**
   * Triggered when user clicks search button
   * Build query params and call search API
   * Sanitize location input to skip whitespace-only location query
   */
  onSearch(): void {
    console.log("=== 点击Search ===");
    this.errorMsg = '';
    const f = this.searchForm.value;
    console.log("表单原始值：", f);
    // Construct query parameters, convert category_id to numeric type
    const params: any = {};
    if (f.date) params.date = f.date;
    // Trim location string, do NOT add param if only whitespace
    if (f.location && f.location.trim() !== '') params.location = f.location.trim();
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

  /**
   * Reset all form inputs, clear search results and error message
   */
  clearFilters(): void {
    this.searchForm.reset({ date: '', location: '', category_id: '' });
    this.results = [];
    this.errorMsg = '';
  }
}
