import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
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
export class EmpProfileComponent {
  @ViewChild('changePasswordDialog') changePasswordDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  changePasswordForm!: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
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

  onSubmit() {
    if (this.changePasswordForm.valid) {
      console.log(this.changePasswordForm.value);
      this.closeDialog();
      // 🔑 Call API to update password here
    }
  }
}
