import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import { TaskService } from '../../../services/task.service';
import { EmployeeService } from '../../../services/employee.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TaskRequestDTO } from '../../../models/task.model';
import { EmployeeResponseDTO } from '../../../models/employee.model';
import { of, catchError } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-assign-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
})
export class AssignTaskComponent implements OnInit {
  taskForm!: FormGroup;
  employees: EmployeeResponseDTO[] = [];
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      employeeId: ['', Validators.required],
      targetDate: ['', Validators.required],
      task: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required],
    });
  }

  private loadEmployees(): void {
    this.employeeService
      .getAllEmployees()
      .pipe(
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load employees');
          return of([]);
        })
      )
      .subscribe((res: any) => {
        if (res && res.success) {
          this.employees = res.data;
        }
      });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      const dto: TaskRequestDTO = {
        task: formValue.task,
        description: formValue.description || '',
        targetDate: moment(formValue.targetDate).format('YYYY-MM-DD'),
        submissionDate: undefined,
        employeeId: formValue.employeeId,
      };

      this.taskService
        .createTask(dto)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to assign task');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Task assigned successfully');
            this.taskForm.reset({
              employeeId: null,
              targetDate: null,
              task: '',
              description: '',
            });

            Object.keys(this.taskForm.controls).forEach((key) => {
              this.taskForm.get(key)?.setErrors(null);
              this.taskForm.get(key)?.markAsPristine();
              this.taskForm.get(key)?.markAsUntouched();
            });
          }
        });
    }
  }
}
