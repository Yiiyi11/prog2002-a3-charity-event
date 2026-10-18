import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { EventDetailComponent } from './pages/event-detail/event-detail';
import { RegisterEventComponent } from './pages/register-event/register-event';
import { SearchEventsComponent } from './pages/search-events/search-events';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'search-events', component: SearchEventsComponent },
  { path: 'register', component: RegisterEventComponent },
  { path: '**', redirectTo: 'home' }
];
