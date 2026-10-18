import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-search-events',
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
        if(res.success){
          this.categories = res.data ?? [];
        }else{
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
    this.errorMsg = '';
    this.results = [];
    const f = this.searchForm.value;
    this.eventSvc.searchEvents({
      date: f.date || undefined,
      location: f.location?.trim() || undefined,
      category_id: f.category_id || undefined
    }).subscribe({
      next: (res: any) => {
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
        // ✅ 强制取data，兜底为空数组，永远不会赋值对象
        this.results = Array.isArray(res.data) ? res.data : [];
      },
      error: (err: any) => {
        this.errorMsg = `Search error: ${err.error?.message || err.message}`;
        this.results = [];
      }
    });
  }

  clearFilters(): void {
    this.searchForm.reset({ date: '', location: '', category_id: '' });
    this.results = [];
    this.errorMsg = '';
  }
}
