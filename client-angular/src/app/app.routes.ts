import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { EventDetailComponent } from './pages/event-detail/event-detail';
import { RegisterEventComponent } from './pages/register-event/register-event';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'register', component: RegisterEventComponent }
];
