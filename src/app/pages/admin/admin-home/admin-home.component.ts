import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatusCountDTO } from '../../../models/task.model';
import { catchError, of } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TaskService } from '../../../services/task.service';
import { ApiResponse } from '../../../utils/apiresponse';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  // Task stats
  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;
  lateTasks: number = 0;
  overdueTasks: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTaskStatusCounts();
  }

  private loadTaskStatusCounts(): void {
    this.taskService
      .getTaskStatusCounts()
      .pipe(
        catchError(() => {
          // fallback to 0 counts
          return of({
            success: true,
            data: {
              total: 0,
              completed: 0,
              pending: 0,
              late: 0,
              overdue: 0,
            } as TaskStatusCountDTO,
          } as ApiResponse<TaskStatusCountDTO>);
        })
      )
      .subscribe((res) => {
        if (res.success && res.data) {
          this.totalTasks = res.data.total;
          this.completedTasks = res.data.completed;
          this.pendingTasks = res.data.pending;
          this.lateTasks = res.data.late;
          this.overdueTasks = res.data.overdue;
        }
      });
  }
}
