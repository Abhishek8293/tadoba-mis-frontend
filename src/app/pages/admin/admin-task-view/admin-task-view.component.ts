import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepickerToggle,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormField, MatError, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';

interface Task {
  id: number;
  task: string;
  description: string;
  assignedDate: Date;
  targetDate: Date;
  submissionDate?: Date | null;
  status: 'Pending' | 'Completed' | 'Late';
}

@Component({
  selector: 'app-admin-task-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
   providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    ],
  templateUrl: './admin-task-view.component.html',
  styleUrl: './admin-task-view.component.css',
})
export class AdminTaskViewComponent {
  //
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('editTaskDialog') editTaskDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  // Simulated input task (later you can pass via routing or service)
  task: Task = {
    id: 1,
    task: 'Prepare Financial Report',
    description:
      'Compile all financial transactions for August and prepare the monthly report for review.',
    assignedDate: new Date('2025-08-30'),
    targetDate: new Date('2025-09-05'),
    submissionDate: null,
    status: 'Pending',
  };

  editTaskForm!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
     this.editTaskForm = this.fb.group({
      task: [this.task.task, Validators.required],
      targetDate: [this.task.targetDate, Validators.required],
    });
  }

  openDeleteDialog() {
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeDeleteDialog() {
    this.dialogRef.close();
  }

  openEditTaskDialog() {
    this.dialogRef = this.dialog.open(this.editTaskDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeEditTaskDialog() {
    this.dialogRef.close();
  }

  updateTask() {
    // TODO: hook up to backend later
    console.log('Updated Task:', this.task);
    this.closeEditTaskDialog();
  }

  goBack() {
    // Navigate back to task list
    window.history.back();
  }

  submitTask() {
    alert('Task Submitted Successfully!');
  }
}
