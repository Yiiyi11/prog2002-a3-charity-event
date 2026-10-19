/**
 * RegisterEventComponent
 * This component handles the registration form for users to sign up for charity events.
 * It uses Angular reactive forms with built-in validators for name, email and event selection.
 */
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from '../../services/registration';

@Component({
  selector: 'app-register-event',
  imports: [ReactiveFormsModule],
  templateUrl: './register-event.html',
  styleUrl: './register-event.css'
})
export class RegisterEventComponent {
  // Reactive form group for event registration inputs
  regForm: FormGroup;
  // Feedback message to display registration success or failure
  msg = '';

  constructor(private fb: FormBuilder, private regSvc: RegistrationService) {
    // Initialize registration form with validation rules
    this.regForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      eventId: [null, Validators.required]
    });
  }

  /**
   * Submit form data to backend registration API
   * Stop submission if form validation fails
   * Show success or error message based on API response
   */
  submit(): void {
    if (this.regForm.invalid) return;
    this.regSvc.createRegistration(this.regForm.value).subscribe({
      next: (res: any) => { this.msg = 'Registration successful!'; },
      error: (err: any) => { this.msg = 'Error: ' + (err.error?.message || err.message); }
    });
  }
}
