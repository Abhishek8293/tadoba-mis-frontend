import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LocalStorageService } from '../../../services/local-storage.service';
import { EmployeeService } from '../../../services/employee.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeResponseDTO } from '../../../models/employee.model';
import { catchError, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ChangePasswordDTO } from '../../../models/change-password.model';
import { Role } from '../../../models/role.enum';
import { DepartmentService } from '../../../services/department.service';
import { DepartmentDTO } from '../../../models/department.model';

@Component({
  selector: 'app-emp-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './emp-profile.component.html',
  styleUrl: './emp-profile.component.css',
})
export class EmpProfileComponent implements OnInit {
  @ViewChild('changePasswordDialog') changePasswordDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  changePasswordForm!: FormGroup;

  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  employee!: EmployeeResponseDTO;
  isIncharge: boolean = false;

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.matchTo('newPassword')]],
    });
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getUser();
    if (storedUser?.id) {
      this.loadEmployee(storedUser.id);
    }

    if (storedUser?.id) {
      this.loadEmployee(storedUser.id);
      this.checkIfIncharge(storedUser.id); 
    }

    const s = this.changePasswordForm
      .get('newPassword')
      ?.valueChanges.subscribe(() => {
        this.changePasswordForm
          .get('confirmPassword')
          ?.updateValueAndValidity({ onlySelf: true });
      });
    if (s) this.subs.push(s);
  }

  private loadEmployee(id: number): void {
    this.employeeService
      .getEmployeeById(id)
      .pipe(
        catchError((err) => {
          this.snackbar.openFailedSnackBar(
            err?.error?.message || 'Failed to load employee profile'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.success && res.data) {
          this.employee = res.data;
        }
      });
  }

  private checkIfIncharge(employeeId: number): void {
    this.departmentService.getAllDepartments().subscribe((res) => {
      if (res.success && res.data) {
        this.isIncharge = res.data.some(
          (dept: DepartmentDTO) => dept.inchargeId === employeeId
        );
      }
    });
  }

  matchTo(matchTo: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.parent) return null;

      const matchingControl = control.parent.get(matchTo);
      if (!matchingControl) return null;

      if (!control.value) return null;

      return control.value === matchingControl.value
        ? null
        : { passwordMismatch: true };
    };
  }

  onSubmit() {
    if (this.changePasswordForm.valid && this.employee) {
      const storedUser = this.localStorageService.getUser();

      const payload: ChangePasswordDTO = {
        id: this.employee.id,
        userType: Role.EMPLOYEE,
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword,
      };

      this.authService.changePassword(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackbar.openSuccessSnackBar(
              res.message || 'Password changed successfully'
            );
            this.closeDialog();
            this.changePasswordForm.reset();
          } else {
            this.snackbar.openFailedSnackBar(
              res.message || 'Failed to change password'
            );
          }
        },
        error: (err) => {
          this.snackbar.openFailedSnackBar(
            err?.error?.message || 'Failed to change password'
          );
        },
      });
    }
  }

  openChangePasswordDialog() {
    this.dialogRef = this.dialog.open(this.changePasswordDialog, {
      width: '400px',
      disableClose: true,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  logout(): void {
    this.localStorageService.clearUser();
    this.router.navigate(['/login']);
  }
}
