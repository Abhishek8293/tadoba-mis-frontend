import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of, map, catchError, Observable } from 'rxjs';

import { DepartmentDTO } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';
import { ApiResponse } from '../../../utils/apiresponse';
import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeResponseDTO } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule
],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'name', 'inchargeName', 'actions'];

  //MatTableDataSource
  dataSource = new MatTableDataSource<DepartmentDTO>([]);

  employees: EmployeeResponseDTO[] = [];

  // Dialog templates
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('departmentDialog') departmentDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  // Form
  departmentForm!: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  selectedDeptId: number | null = null;

  constructor(
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      inchargeId: [null],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService
      .getAllDepartments()
      .pipe(
        map((res: ApiResponse<DepartmentDTO[]>) => res.data),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load departments');
          return of([]);
        })
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  // Open Add Dialog
  openAddDepartmentDialog(): void {
    this.dialogMode = 'add';
    this.selectedDeptId = null;
    this.departmentForm.reset();
    this.dialogRef = this.dialog.open(this.departmentDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  // Open Edit Dialog
  openEditDepartmentDialog(dept: DepartmentDTO): void {
    this.dialogMode = 'edit';
    this.selectedDeptId = dept.id;
      this.loadEmployees();
    this.departmentForm.patchValue({
      name: dept.name,
      inchargeId: dept.inchargeId || null,
    });
    this.dialogRef = this.dialog.open(this.departmentDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  closeDepartmentDialog(): void {
    this.dialogRef.close();
  }

  saveDepartment(): void {
    if (this.departmentForm.valid) {
      const deptName = this.departmentForm.value.name;
      const inchargeId = this.departmentForm.value.inchargeId;

      let apiCall: Observable<ApiResponse<DepartmentDTO>>;
      let successMessage = '';

      if (this.dialogMode === 'add') {
        apiCall = this.departmentService.createDepartment(deptName);
        successMessage = 'Department added successfully!';
      } else {
        apiCall = this.departmentService.updateDepartment(
          this.selectedDeptId!,
          deptName,
          inchargeId
        );
        successMessage = 'Department updated successfully!';
      }

      apiCall
        .pipe(
          map((res) => res.data),
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to save department');
            return of(null);
          })
        )
        .subscribe((result) => {
          if (result) {
            this.snackbar.openSuccessSnackBar(successMessage);
            this.loadDepartments();
            this.closeDepartmentDialog();
          }
        });
    }
  }

  // Delete confirmation
  openDeleteDialog(id: number): void {
    this.selectedDeptId = id;
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  closeDeleteDialog(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    if (this.selectedDeptId !== null) {
      this.departmentService
        .deleteDepartment(this.selectedDeptId)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to delete department');
            return of({ success: false } as ApiResponse<void>);
          })
        )
        .subscribe((res: ApiResponse<void>) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar(
              'Department deleted successfully!'
            );
            this.loadDepartments();
            this.closeDeleteDialog();
          } else {
            this.snackbar.openFailedSnackBar('Failed to delete department');
          }
        });
    }
  }

  get totalDepartments(): number {
    return this.dataSource.data.length;
  }

   loadEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(
        map((res: ApiResponse<EmployeeResponseDTO[]>) => res.data), 
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load employees');
          return of([]);
        })
      )
      .subscribe((data: EmployeeResponseDTO[]) => this.employees = data); 
  }
}
