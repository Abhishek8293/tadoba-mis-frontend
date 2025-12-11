import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeService } from '../../../services/employee.service';
import { ReportService } from '../../../services/report.service';
import {
  ReportSummary,
  ReportRequest,
  EmployeeOption,
} from '../../../models/report.model';

@Component({
  selector: 'app-employee-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employee-report.component.html',
  styleUrl: './employee-report.component.css',
})
export class EmployeeReportComponent implements OnInit {
  // ---------------- Dropdowns -----------------
  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  years: number[] = [];
  employees: EmployeeOption[] = [];

  // -------------- Selected Filters ----------------
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  selectedEmployee: number | null = null;

  // Summary Data
  showSummary = false;
  summary!: ReportSummary;

  constructor(
    private reportService: ReportService,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
  ) {
    // Years from 2025 to 2030
    this.years = [2025, 2026, 2027, 2028, 2029, 2030];
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService
      .getAllEmployees()
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load employees');
          return of([]);
        })
      )
      .subscribe((res: any) => {
        if (res?.success) {
          this.employees = res.data;
        }
      });
  }

  // ------------------ GET REPORT ------------------
  getReport() {
    if (!this.selectedMonth || !this.selectedYear || !this.selectedEmployee) {
      this.snackbar.openFailedSnackBar('Please select all filters');
      return;
    }

    this.reportService
      .getEmployeeSummary(
        this.selectedEmployee,
        this.selectedMonth,
        this.selectedYear
      )
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to fetch report');
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res?.success) {
          this.summary = res.data;
          this.showSummary = true;
        }
      });
  }

  // ------------------ CLEAR FILTERS ------------------
  clearFilters() {
    this.selectedMonth = null;
    this.selectedYear = null;
    this.selectedEmployee = null;
    this.showSummary = false;
  }

  // ------------------ EXPORT EXCEL ------------------
  exportExcel() {
    if (!this.selectedMonth || !this.selectedYear || !this.selectedEmployee) {
      this.snackbar.openFailedSnackBar('Select filters before exporting Excel');
      return;
    }

    this.reportService
      .downloadExcel(
        this.selectedEmployee,
        this.selectedMonth,
        this.selectedYear
      )
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to download Excel');
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (!response) return;

        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Extract filename from header
        let filename = 'employee_report.xlsx';
        const disposition = response.headers.get('content-disposition');

        if (disposition) {
          const match = disposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // <-- now correct from backend
        a.click();
        window.URL.revokeObjectURL(url);

        this.snackbar.openSuccessSnackBar('Excel downloaded');
      });
  }
}
