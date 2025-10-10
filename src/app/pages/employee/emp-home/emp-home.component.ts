import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TaskService } from '../../../services/task.service';
import { ApiResponse } from '../../../utils/apiresponse';
import { catchError, of } from 'rxjs';
import { TaskStatusCountDTO } from '../../../models/task.model';
import { EmpNoticeComponent } from "../emp-notice/emp-notice.component";
import { EmpHighlightComponent } from "../emp-highlight/emp-highlight.component";

@Component({
  selector: 'app-emp-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, EmpNoticeComponent, EmpHighlightComponent],
  templateUrl: './emp-home.component.html',
  styleUrl: './emp-home.component.css',
})
export class EmpHomeComponent implements OnInit {
  employeeName: string = '';
  employeeId: number | null = null;

  // Task stats
  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;
  lateTasks: number = 0;
  overdueTasks: number = 0;

  constructor(
    private localStorageService: LocalStorageService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser();
    this.employeeName = user?.name || 'Employee';
    this.employeeId = user?.id || null;

    if (this.employeeId) {
      this.loadTaskStatusCounts(this.employeeId);
    }
  }

  private loadTaskStatusCounts(employeeId: number): void {
    this.taskService
      .getTaskStatusCounts(employeeId)
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
