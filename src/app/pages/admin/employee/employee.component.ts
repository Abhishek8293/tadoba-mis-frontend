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
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

interface Employee {
  id: number;
  name: string;
  department: string;
  mail: string;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;
  @ViewChild('addEmployeeDialog') addEmployeeDialogTemplate!: TemplateRef<any>;
  @ViewChild('editEmployeeDialog')
  editEmployeeDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  //form
  addEmployeeForm!: FormGroup;
  editEmployeeForm!: FormGroup;

  // Filter
  selectedDepartment: string = '';

  // Sample departments
  departments: string[] = ['HR', 'Finance', 'IT', 'Marketing', 'Operations'];

  // Sample employee data
  employees: Employee[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      department: 'IT',
      mail: 'sharma.rahul@gmail.com',
    },
    {
      id: 2,
      name: 'Priya Verma',
      department: 'HR',
      mail: 'piyesh123@gmail.com',
    },
    {
      id: 3,
      name: 'Amit Patel',
      department: 'Finance',
      mail: 'patel24@gmail.com',
    },
    {
      id: 4,
      name: 'Neha Singh',
      department: 'IT',
      mail: 'singh.neha@gmail.com',
    },
    {
      id: 5,
      name: 'Rohan Mehta',
      department: 'Marketing',
      mail: 'mehta.rohan@gmail.com',
    },
    {
      id: 6,
      name: 'Kavya Iyer',
      department: 'Operations',
      mail: 'abc@gmail.com',
    },
    {
      id: 7,
      name: 'Arjun Reddy',
      department: 'Finance',
      mail: 'abc@gmail.com',
    },
    { id: 8, name: 'Sneha Nair', department: 'HR', mail: 'abc@gmail.com' },
  ];

  displayedColumns: string[] = ['srNo', 'name', 'mail', 'department', 'action'];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
    });

    this.editEmployeeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
    });

    this.dataSource.filterPredicate = (employee: Employee, filter: string) => {
      return (
        !filter || employee.department.toLowerCase() === filter.toLowerCase()
      );
    };
  }

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

  openDeleteDialog() {
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeDeleteDialog() {
    this.dialogRef.close();
  }

  openAddEmployeeDialog() {
    this.addEmployeeForm.reset();
    this.dialogRef = this.dialog.open(this.addEmployeeDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }
  closeAddEmployeeDialog() {
    this.dialogRef.close();
  }
  saveNewEmployee() {
    if (this.addEmployeeForm.valid) {
      const newEmp: Employee = {
        id: this.employees.length + 1,
        ...this.addEmployeeForm.value,
      };
      this.employees.push(newEmp);
      this.dataSource.data = [...this.employees];
      this.closeAddEmployeeDialog();
    }
  }

  // open Edit
  openEditEmployeeDialog() {
    // this.editEmployeeForm.patchValue(emp);
    this.dialogRef = this.dialog.open(this.editEmployeeDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }
  closeEditEmployeeDialog() {
    this.dialogRef.close();
  }
  updateEmployee() {
    if (this.editEmployeeForm.valid) {
      const updated = this.editEmployeeForm.value;
      const index = this.employees.findIndex((e) => e.id === updated.id);
      if (index > -1) this.employees[index] = updated;
      this.dataSource.data = [...this.employees];
      this.closeEditEmployeeDialog();
    }
  }
}
