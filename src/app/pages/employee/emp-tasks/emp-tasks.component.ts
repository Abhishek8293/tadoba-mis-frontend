import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

interface Task {
  id: number;
  task: string;
  assignedDate: Date;
  targetDate: Date;
  submissionDate: Date | null;
  status: 'Pending' | 'Completed' | 'Late';
}

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
    MatIcon,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './emp-tasks.component.html',
  styleUrl: './emp-tasks.component.css',
})
export class EmpTasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isMobile: boolean = false;
  filtersOpen: boolean = false;

  // Filters
  selectedStatus: string = '';
  selectedDate: Date | null = null;

  // Sample data (15 tasks)
  tasks: Task[] = [
    {
      id: 1,
      task: 'Prepare Financial Report',
      assignedDate: new Date('2025-08-30'),
      targetDate: new Date('2025-09-05'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 2,
      task: 'Client Meeting',
      assignedDate: new Date('2025-08-28'),
      targetDate: new Date('2025-09-03'),
      submissionDate: new Date('2025-09-03'),
      status: 'Completed',
    },
    {
      id: 3,
      task: 'Submit Invoice',
      assignedDate: new Date('2025-08-27'),
      targetDate: new Date('2025-09-01'),
      submissionDate: new Date('2025-09-04'),
      status: 'Late',
    },
    {
      id: 4,
      task: 'Update Presentation',
      assignedDate: new Date('2025-08-31'),
      targetDate: new Date('2025-09-07'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 5,
      task: 'Audit Documents',
      assignedDate: new Date('2025-08-29'),
      targetDate: new Date('2025-09-04'),
      submissionDate: new Date('2025-09-04'),
      status: 'Completed',
    },
    {
      id: 6,
      task: 'Draft Proposal',
      assignedDate: new Date('2025-09-01'),
      targetDate: new Date('2025-09-09'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 7,
      task: 'Prepare Training Plan',
      assignedDate: new Date('2025-08-30'),
      targetDate: new Date('2025-09-06'),
      submissionDate: new Date('2025-09-06'),
      status: 'Completed',
    },
    {
      id: 8,
      task: 'Organize Workshop',
      assignedDate: new Date('2025-09-01'),
      targetDate: new Date('2025-09-08'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 9,
      task: 'Follow-up with Vendor',
      assignedDate: new Date('2025-08-27'),
      targetDate: new Date('2025-09-02'),
      submissionDate: new Date('2025-09-05'),
      status: 'Late',
    },
    {
      id: 10,
      task: 'Design Brochure',
      assignedDate: new Date('2025-09-02'),
      targetDate: new Date('2025-09-10'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 11,
      task: 'Compile Survey Data',
      assignedDate: new Date('2025-08-31'),
      targetDate: new Date('2025-09-05'),
      submissionDate: new Date('2025-09-05'),
      status: 'Completed',
    },
    {
      id: 12,
      task: 'HR Interview Scheduling',
      assignedDate: new Date('2025-09-02'),
      targetDate: new Date('2025-09-11'),
      submissionDate: null,
      status: 'Pending',
    },
    {
      id: 13,
      task: 'Market Analysis Report',
      assignedDate: new Date('2025-08-28'),
      targetDate: new Date('2025-09-03'),
      submissionDate: new Date('2025-09-03'),
      status: 'Completed',
    },
    {
      id: 14,
      task: 'Inventory Check',
      assignedDate: new Date('2025-08-27'),
      targetDate: new Date('2025-09-01'),
      submissionDate: new Date('2025-09-02'),
      status: 'Late',
    },
    {
      id: 15,
      task: 'Prepare Newsletter',
      assignedDate: new Date('2025-09-04'),
      targetDate: new Date('2025-09-12'),
      submissionDate: null,
      status: 'Pending',
    },
  ];

  displayedColumns: string[] = [
    'srNo',
    'task',
    'assignedDate',
    'targetDate',
    'submissionDate',
    'status',
    'view',
  ];

  constructor() {}

  dataSource = new MatTableDataSource<Task>(this.tasks);

  ngOnInit(): void {
    // Custom filter logic
    this.dataSource.filterPredicate = (task: Task, filter: string) => {
      const f = JSON.parse(filter);

      const matchesStatus =
        !f.status || task.status.toLowerCase() === f.status.toLowerCase();

      const matchesDate =
        !f.date ||
        new Date(task.targetDate).toDateString() ===
          new Date(f.date).toDateString();

      return matchesStatus && matchesDate;
    };

    //
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {
    const filterObj = {
      status: this.selectedStatus,
      date: this.selectedDate,
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedDate = null;
    this.applyFilters();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.filtersOpen = true; // always open on desktop
    }
  }

}
