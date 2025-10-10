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
import { EmployeeService } from '../../../services/employee.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TaskResponseDTO } from '../../../models/task.model';
import { EmployeeResponseDTO } from '../../../models/employee.model';
import { catchError, map, of } from 'rxjs';
import { ApiResponse } from '../../../utils/apiresponse';
import moment from 'moment';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
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
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isMobile: boolean = false;
  filtersOpen: boolean = false;

  // Filters
  selectedStatus: string = '';
  selectedEmployee: number | null = null;
  selectedDate: Date | null = null;

  employees: EmployeeResponseDTO[] = [];
  displayedColumns: string[] = [
    'srNo',
    'name',
    'task',
    'assignedDate',
    'targetDate',
    'submissionDate',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<TaskResponseDTO>([]);

  constructor(
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTasks();
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees(): void {
    this.employeeService
      .getAllEmployees()
      .pipe(
        map((res: ApiResponse<EmployeeResponseDTO[]>) => res.data),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load employees');
          return of([]);
        })
      )
      .subscribe((data) => {
        this.employees = data;
      });
  }

  loadTasks(): void {
    let formattedDate: string | undefined = undefined;

    if (this.selectedDate) {
      formattedDate = moment(this.selectedDate).format('YYYY-MM-DD');
    }

    this.taskService
      .getAllTasks(
        this.selectedStatus || undefined,
        this.selectedEmployee || undefined,
        formattedDate
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
    this.selectedEmployee = null;
    this.selectedDate = null;
    this.applyFilters();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.filtersOpen = true;
    }
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
