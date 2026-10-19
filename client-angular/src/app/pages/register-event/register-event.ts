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
  regForm: FormGroup;
  msg = '';

  constructor(private fb: FormBuilder, private regSvc: RegistrationService) {
    this.regForm = this.fb.group({
      contact_fullname: ['', Validators.required],
      contact_email: ['', [Validators.required, Validators.email]],
      contact_phone: ['', Validators.required],
      ticket_quantity: [1, [Validators.required, Validators.min(1)]],
      eventId: [null, Validators.required]
    });
  }

  submit(): void {
    if (this.regForm.invalid) return;
    this.regSvc.createRegistration(this.regForm.value).subscribe({
      next: (res: any) => { this.msg = 'Registration successful!'; },
      error: (err: any) => { this.msg = 'Error: ' + (err.error?.message || err.message); }
    });
  }
}
