import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  department: string;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filter
  selectedDepartment: string = '';

  // Sample departments
  departments: string[] = ['HR', 'Finance', 'IT', 'Marketing', 'Operations'];

  // Sample employee data
  employees: Employee[] = [
    { id: 1, name: 'Rahul Sharma', department: 'IT' },
    { id: 2, name: 'Priya Verma', department: 'HR' },
    { id: 3, name: 'Amit Patel', department: 'Finance' },
    { id: 4, name: 'Neha Singh', department: 'IT' },
    { id: 5, name: 'Rohan Mehta', department: 'Marketing' },
    { id: 6, name: 'Kavya Iyer', department: 'Operations' },
    { id: 7, name: 'Arjun Reddy', department: 'Finance' },
    { id: 8, name: 'Sneha Nair', department: 'HR' },
  ];

  displayedColumns: string[] = ['srNo', 'name', 'department', 'action'];

  dataSource = new MatTableDataSource<Employee>(this.employees);

  ngOnInit(): void {
    this.dataSource.filterPredicate = (employee: Employee, filter: string) => {
      return (
        !filter || employee.department.toLowerCase() === filter.toLowerCase()
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = this.selectedDepartment;
  }

  resetFilter() {
    this.selectedDepartment = '';
    this.applyFilter();
  }

  get totalEmployees(): number {
    return this.dataSource.filteredData.length;
  }
}
