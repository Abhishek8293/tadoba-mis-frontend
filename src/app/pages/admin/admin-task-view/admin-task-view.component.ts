import { CommonModule } from '@angular/common';
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TaskResponseDTO } from '../../../models/task.model';
import { catchError, of } from 'rxjs';
import moment from 'moment';

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
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './admin-task-view.component.html',
  styleUrls: ['./admin-task-view.component.css'],
})
export class AdminTaskViewComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('editTaskDialog') editTaskDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  task!: TaskResponseDTO;
  editTaskForm!: FormGroup;
  taskId!: number;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackbar: SnackbarService
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
    this.editTaskForm = this.fb.group({
      task: [this.task.task, Validators.required],
      description: [this.task.description, Validators.required],
      targetDate: [
        this.task.targetDate ? moment(this.task.targetDate).toDate() : null,
        Validators.required,
      ],
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
      const dto = {
        ...this.task,
        task: formValue.task,
         description: formValue.description,
        targetDate: moment(formValue.targetDate).format('YYYY-MM-DD'),
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
}
