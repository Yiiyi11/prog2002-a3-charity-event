import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetailComponent implements OnInit {
  event: any;
  registrations: any[] = [];
  errorMsg = '';

  constructor(private route: ActivatedRoute, private eventSvc: EventService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventSvc.getEvent(id).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.errorMsg = res.message;
          return;
        }
        this.event = res.data.event;
        this.registrations = res.data.registrations || [];
      },
      error: (err: any) => {
        this.errorMsg = `Failed to load event: ${err.message}`;
      }
    });
  }
}
