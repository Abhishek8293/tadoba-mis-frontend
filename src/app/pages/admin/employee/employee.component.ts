import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { of, map, catchError } from 'rxjs';

import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { DepartmentDTO } from '../../../models/department.model';
import { ApiResponse } from '../../../utils/apiresponse';
import {
  EmployeeResponseDTO,
  EmployeeRequestDTO,
} from '../../../models/employee.model';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import moment from 'moment';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'srNo',
    'joiningDate',
    'name',
    'email',
    'dob',
    'responsibilities',
    'department',
    'action',
  ];
  dataSource = new MatTableDataSource<EmployeeResponseDTO>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dialog refs
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('addEmployeeDialog') addEmployeeDialogTemplate!: TemplateRef<any>;
  @ViewChild('editEmployeeDialog')
  editEmployeeDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  // Forms
  addEmployeeForm!: FormGroup;
  editEmployeeForm!: FormGroup;

  selectedDepartment: number | null = null;

  // Dropdown departments
  departments: DepartmentDTO[] = [];

  selectedEmpId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadEmployees();
    this.loadDepartments();

    // Custom filter for department
    this.dataSource.filterPredicate = (
      emp: EmployeeResponseDTO,
      filter: string
    ): boolean => {
      if (!filter) return true;
      const f = JSON.parse(filter) as { departmentId?: number };
      return !f.departmentId || emp.departmentId === f.departmentId;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initForms(): void {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentId: ['', Validators.required],
      joiningDate: ['', Validators.required],
      dob: ['', Validators.required],
      responsibilities: ['', Validators.required],
    });

    this.editEmployeeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentId: ['', Validators.required],
      joiningDate: ['', Validators.required],
      dob: ['', Validators.required],
      responsibilities: ['', Validators.required],
    });
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
        this.dataSource.data = data;
      });
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
        this.departments = data;
      });
  }

  get totalEmployees(): number {
    return this.dataSource.filteredData.length;
  }

  openAddEmployeeDialog(): void {
    this.addEmployeeForm.reset();
    this.dialogRef = this.dialog.open(this.addEmployeeDialogTemplate, {
      width: '500px',
      maxHeight: '95vh',
      disableClose: true,
    });
  }

  saveNewEmployee(): void {
    if (this.addEmployeeForm.valid) {
      const formValue = this.addEmployeeForm.value;

      const dto: EmployeeRequestDTO = {
        name: formValue.name,
        email: formValue.email,
        password: 'default123',
        departmentId: formValue.departmentId,
        joiningDate: moment(formValue.joiningDate).format('YYYY-MM-DD'),
        dob: moment(formValue.dob).format('YYYY-MM-DD'),
        responsibilities: formValue.responsibilities || '',
      };

      this.employeeService
        .createEmployee(dto)
        .pipe(
          catchError((err) => {
            const backendMsg = err?.error?.message || 'Failed to save employee';
            this.snackbar.openFailedSnackBar(backendMsg);
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Employee added successfully');
            this.loadEmployees();
            this.closeDialog();
          }
        });
    }
  }

  openEditEmployeeDialog(emp: EmployeeResponseDTO): void {
    this.selectedEmpId = emp.id;
    this.editEmployeeForm.patchValue({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      departmentId: emp.departmentId,
      joiningDate: emp.joiningDate
        ? moment(emp.joiningDate, 'YYYY-MM-DD').toDate()
        : null,
      dob: emp.dob ? moment(emp.dob, 'YYYY-MM-DD').toDate() : null,
      responsibilities: emp.responsibilities,
    });
    this.dialogRef = this.dialog.open(this.editEmployeeDialogTemplate, {
      width: '500px',
      maxHeight: '95vh',
      disableClose: true,
    });
  }

  updateEmployee(): void {
    if (this.editEmployeeForm.valid && this.selectedEmpId !== null) {
      const formValue = this.editEmployeeForm.value;

      const dto: EmployeeRequestDTO = {
        ...formValue,
        joiningDate: formValue.joiningDate
          ? moment(formValue.joiningDate).format('YYYY-MM-DD')
          : null,
        dob: formValue.dob ? moment(formValue.dob).format('YYYY-MM-DD') : null,
      };

      this.employeeService
        .updateEmployee(this.selectedEmpId, dto)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to update employee');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Employee updated successfully');
            this.loadEmployees();
            this.closeDialog();
          }
        });
    }
  }

  openDeleteDialog(id: number): void {
    this.selectedEmpId = id;
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  confirmDelete(): void {
    if (this.selectedEmpId !== null) {
      this.employeeService
        .deleteEmployee(this.selectedEmpId)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to delete employee');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Employee deleted successfully');
            this.loadEmployees();
            this.closeDialog();
          }
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  applyFilter(): void {
    const filterObj = { departmentId: this.selectedDepartment || null };
    this.dataSource.filter = JSON.stringify(filterObj);
  }
}
