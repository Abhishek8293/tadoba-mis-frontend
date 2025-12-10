import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TaskResponseDTO } from '../../../models/task.model';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
  selector: 'app-admin-task-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxMatTimepickerModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],

  templateUrl: './admin-task-view.component.html',
  styleUrls: ['./admin-task-view.component.css'],
})
export class AdminTaskViewComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('editTaskDialog') editTaskDialogTemplate!: TemplateRef<any>;
  @ViewChild('adminRatingDialog') adminRatingDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  task!: TaskResponseDTO;
  editTaskForm!: FormGroup;
  taskId!: number;
  minDate: Date = new Date();
  adminRating: number = 0;
  adminRemarks: string = '';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackbar: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask();
  }

  loadTask(): void {
    this.taskService
      .getTaskById(this.taskId)
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load task');
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.success && res.data) {
          this.task = res.data;
          this.initForm();
        }
      });
  }

  private initForm(): void {
    // Parse backend ISO string (e.g., 2025-10-22T03:30:00)
    const dateTime = moment(this.task.targetDate, moment.ISO_8601);
    moment.locale('en-gb');

    this.editTaskForm = this.fb.group({
      task: [this.task.task, Validators.required],
      description: [this.task.description, Validators.required],
      targetDate: [dateTime, Validators.required],
      targetTime: [dateTime.format('hh:mm A'), Validators.required],
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

  confirmDelete(): void {
    this.taskService
      .deleteTask(this.taskId)
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to delete task');
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.success) {
          this.snackbar.openSuccessSnackBar('Task deleted successfully');
          this.closeDeleteDialog();
          this.router.navigate(['/admin/tasks']);
        }
      });
  }

  openEditTaskDialog() {
    console.log(this.editTaskForm.value);
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
    if (this.editTaskForm.valid) {
      const formValue = this.editTaskForm.value;

      const parsedTime = moment(formValue.targetTime, ['h:mm A', 'HH:mm']);
      const finalDateTime = moment(formValue.targetDate)
        .set({
          hour: parsedTime.hour(),
          minute: parsedTime.minute(),
          second: 0,
          millisecond: 0,
        })
        .format('YYYY-MM-DDTHH:mm:ss');

      const dto = {
        ...this.task,
        task: formValue.task,
        description: formValue.description,
        targetDate: finalDateTime,
      };

      this.taskService
        .updateTask(this.taskId, dto)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to update task');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Task updated successfully');
            this.task = res.data;
            this.closeEditTaskDialog();
          }
        });
    }
  }

  goBack() {
    this.router.navigate(['/admin/tasks']);
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
  openAdminRatingDialog() {
    this.adminRating = 0;
    this.dialogRef = this.dialog.open(this.adminRatingDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeAdminRatingDialog() {
    this.dialogRef.close();
    this.adminRating = 0;
    this.adminRemarks = '';
  }

  submitAdminRating() {
    if (this.adminRating === 0) {
      this.snackbar.openFailedSnackBar(
        'Please give a rating before submitting.'
      );
      return;
    }

    if (this.adminRemarks.trim().length <= 3) {
      this.snackbar.openFailedSnackBar('Please provide remarks');
      return;
    }

    const dto = {
      adminRating: this.adminRating,
      adminRemarks: this.adminRemarks?.trim() || '',
    };

    this.taskService
      .updateTask(this.taskId, dto)
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to submit rating');
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res?.success) {
          this.snackbar.openSuccessSnackBar('Rating submitted successfully');
          this.task = res.data;
          this.closeAdminRatingDialog();
        }
      });
  }
}
