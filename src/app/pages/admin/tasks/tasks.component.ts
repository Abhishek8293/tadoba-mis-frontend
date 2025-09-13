import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
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

interface Task {
  id: number;
  name: string;
  task: string;
  targetDate: Date;
  submissionDate: Date | null;
  status: 'Pending' | 'Completed' | 'Late';
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    FormsModule,
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
    MatSortModule
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filters
  selectedStatus: string = '';
  selectedEmployee: string = '';
  selectedDate: Date | null = null;

  // Sample employee list (15 Indian names)
employees: string[] = [
  'Rahul Sharma',
  'Priya Verma',
  'Amit Patel',
  'Neha Singh',
  'Rohan Mehta',
  'Kavya Iyer',
  'Arjun Reddy',
  'Sanya Malhotra',
  'Vikram Desai',
  'Ananya Gupta',
  'Manish Kumar',
  'Sneha Nair',
  'Harshad Joshi',
  'Pooja Bansal',
  'Devansh Chawla'
];

// Sample data (15 tasks)
tasks: Task[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    task: 'Prepare Financial Report',
    targetDate: new Date('2025-09-05'),
    submissionDate: null, // not submitted yet
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Priya Verma',
    task: 'Client Meeting',
    targetDate: new Date('2025-09-03'),
    submissionDate: new Date('2025-09-03'),
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Amit Patel',
    task: 'Submit Invoice',
    targetDate: new Date('2025-09-01'),
    submissionDate: new Date('2025-09-04'),
    status: 'Late',
  },
  {
    id: 4,
    name: 'Neha Singh',
    task: 'Update Presentation',
    targetDate: new Date('2025-09-07'),
    submissionDate: null,
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Rohan Mehta',
    task: 'Audit Documents',
    targetDate: new Date('2025-09-04'),
    submissionDate: new Date('2025-09-04'),
    status: 'Completed',
  },
  {
    id: 6,
    name: 'Kavya Iyer',
    task: 'Draft Proposal',
    targetDate: new Date('2025-09-09'),
    submissionDate: null,
    status: 'Pending',
  },
  {
    id: 7,
    name: 'Arjun Reddy',
    task: 'Prepare Training Plan',
    targetDate: new Date('2025-09-06'),
    submissionDate: new Date('2025-09-06'),
    status: 'Completed',
  },
  {
    id: 8,
    name: 'Sanya Malhotra',
    task: 'Organize Workshop',
    targetDate: new Date('2025-09-08'),
    submissionDate: null,
    status: 'Pending',
  },
  {
    id: 9,
    name: 'Vikram Desai',
    task: 'Follow-up with Vendor',
    targetDate: new Date('2025-09-02'),
    submissionDate: new Date('2025-09-05'),
    status: 'Late',
  },
  {
    id: 10,
    name: 'Ananya Gupta',
    task: 'Design Brochure',
    targetDate: new Date('2025-09-10'),
    submissionDate: null,
    status: 'Pending',
  },
  {
    id: 11,
    name: 'Manish Kumar',
    task: 'Compile Survey Data',
    targetDate: new Date('2025-09-05'),
    submissionDate: new Date('2025-09-05'),
    status: 'Completed',
  },
  {
    id: 12,
    name: 'Sneha Nair',
    task: 'HR Interview Scheduling',
    targetDate: new Date('2025-09-11'),
    submissionDate: null,
    status: 'Pending',
  },
  {
    id: 13,
    name: 'Harshad Joshi',
    task: 'Market Analysis Report',
    targetDate: new Date('2025-09-03'),
    submissionDate: new Date('2025-09-03'),
    status: 'Completed',
  },
  {
    id: 14,
    name: 'Pooja Bansal',
    task: 'Inventory Check',
    targetDate: new Date('2025-09-01'),
    submissionDate: new Date('2025-09-02'),
    status: 'Late',
  },
  {
    id: 15,
    name: 'Devansh Chawla',
    task: 'Prepare Newsletter',
    targetDate: new Date('2025-09-12'),
    submissionDate: null,
    status: 'Pending',
  },
];


  displayedColumns: string[] = [
    'srNo',
    'name',
    'task',
    'targetDate',
    'submissionDate',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<Task>(this.tasks);

  ngOnInit(): void {
    // Custom filter logic
    this.dataSource.filterPredicate = (task: Task, filter: string) => {
      const f = JSON.parse(filter);

      const matchesStatus =
        !f.status || task.status.toLowerCase() === f.status.toLowerCase();

      const matchesEmployee =
        !f.employee || task.name.toLowerCase() === f.employee.toLowerCase();

      const matchesDate =
        !f.date ||
        new Date(task.targetDate).toDateString() ===
          new Date(f.date).toDateString();

      return matchesStatus && matchesEmployee && matchesDate;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {
    const filterObj = {
      status: this.selectedStatus,
      employee: this.selectedEmployee,
      date: this.selectedDate,
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedEmployee = '';
    this.selectedDate = null;
    this.applyFilters();
  }
}
