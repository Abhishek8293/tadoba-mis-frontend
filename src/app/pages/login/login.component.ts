import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { LoginDTO } from '../../models/login.model';
import { Role } from '../../models/role.enum';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  hidePassword = true;

  employeeLoginForm: FormGroup;
  adminLoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.employeeLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onEmployeeLogin() {
    if (this.employeeLoginForm.valid) {
      const dto: LoginDTO = {
        userType: Role.EMPLOYEE,
        email: this.employeeLoginForm.value.email,
        password: this.employeeLoginForm.value.password,
      };

      this.authService
        .login(dto)
        .pipe(
          catchError((err) => {
            const backendMsg = err?.error?.message || 'Employee login failed';
            this.snackbar.openFailedSnackBar(backendMsg);
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.localStorageService.setUser({
              id: res.data.id,
              name: res.data.name,
              userType: res.data.userType,
            });
            this.snackbar.openSuccessSnackBar('Employee login successful');
            this.router.navigate(['/']);
            console.log('Employee Login Response:', res.data);
          }
        });
    } else {
      this.employeeLoginForm.markAllAsTouched();
    }
  }

  onAdminLogin() {
    if (this.adminLoginForm.valid) {
      const dto: LoginDTO = {
        userType: Role.ADMIN,
        email: this.adminLoginForm.value.email,
        password: this.adminLoginForm.value.password,
      };

      this.authService
        .login(dto)
        .pipe(
          catchError((err) => {
            const backendMsg = err?.error?.message || 'Admin login failed';
            this.snackbar.openFailedSnackBar(backendMsg);
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.localStorageService.setUser({
              id: res.data.id,
              name: res.data.name,
              userType: res.data.userType,
            });
            this.snackbar.openSuccessSnackBar('Admin login successful');
            this.router.navigate(['/admin']);
            console.log('Admin Login Response:', res.data);
          }
        });
    } else {
      this.adminLoginForm.markAllAsTouched();
    }
  }
}
