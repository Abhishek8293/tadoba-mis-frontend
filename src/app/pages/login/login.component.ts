import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hidePassword: boolean = true;

  employeeLoginForm: FormGroup;
  adminLoginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeLoginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.adminLoginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onEmployeeLogin() {
    if (this.employeeLoginForm.valid) {
      console.log('Employee Login Data:', this.employeeLoginForm.value);
      // TODO: call backend
    } else {
      this.employeeLoginForm.markAllAsTouched();
    }
  }

  onAdminLogin() {
    if (this.adminLoginForm.valid) {
      console.log('Admin Login Data:', this.adminLoginForm.value);
      // TODO: call backend
    } else {
      this.adminLoginForm.markAllAsTouched();
    }
  }
}
