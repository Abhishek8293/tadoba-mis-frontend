import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TaskResponseDTO } from '../../../models/task.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-emp-task-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  providers: [DatePipe],
  templateUrl: './emp-task-view.component.html',
  styleUrl: './emp-task-view.component.css',
})
export class EmpTaskViewComponent implements OnInit {
  @ViewChild('submitDialog') submitDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  taskId!: number;
  task!: TaskResponseDTO;

  empRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
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
        }
      });
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

  openSubmitDialog() {
    this.dialogRef = this.dialog.open(this.submitDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeSubmitDialog() {
    this.dialogRef.close();
    this.empRating = 0;
  }

  confirmSubmit(): void {
    if (this.empRating === 0) {
      this.snackbar.openFailedSnackBar(
        'Please give a rating before submitting.'
      );
      return;
    }

    const data = { empRating: this.empRating };

    this.taskService.updateTask(this.taskId, data).subscribe(() => {
      this.taskService
        .submitTask(this.taskId)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to submit task');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res?.success) {
            this.snackbar.openSuccessSnackBar('Task submitted successfully');
            this.task = res.data;
            this.closeSubmitDialog();
          }
        });
    });
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
