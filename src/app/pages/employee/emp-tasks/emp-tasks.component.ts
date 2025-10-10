import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TaskResponseDTO } from '../../../models/task.model';
import { ApiResponse } from '../../../utils/apiresponse';
import { catchError, map, of } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-emp-tasks',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './emp-tasks.component.html',
  styleUrls: ['./emp-tasks.component.css'],
})
export class EmpTasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isMobile: boolean = false;
  filtersOpen: boolean = false;

  // Filters
  selectedStatus: string = '';
  selectedDate: Date | null = null;

  displayedColumns: string[] = [
    'srNo',
    'task',
    'assignedDate',
    'targetDate',
    'submissionDate',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<TaskResponseDTO>([]);

  private employeeId!: number;

  constructor(
    private taskService: TaskService,
    private snackbar: SnackbarService,
    private localStorage: LocalStorageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const user = this.localStorage.getUser();
    if (user?.id) {
      this.employeeId = user.id;
      this.loadTasks();
    }

    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadTasks(): void {
    this.taskService
      .getAllTasks(
        this.selectedStatus || undefined,
        this.employeeId,
        this.selectedDate
          ? moment(this.selectedDate).format('YYYY-MM-DD')
          : undefined
      )
      .pipe(
        map((res: ApiResponse<TaskResponseDTO[]>) => res.data),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load tasks');
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.dataSource.data = tasks;
      });
  }

  applyFilters(): void {
    this.loadTasks();
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedDate = null;
    this.applyFilters();
  }

  submitTask(id: number): void {
    this.taskService
      .submitTask(id)
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to submit task');
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.success) {
          this.snackbar.openSuccessSnackBar('Task submitted successfully');
          this.loadTasks();
        }
      });
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.filtersOpen = true;
    }
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
