import { Component } from '@angular/core';
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
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CUSTOM_DATE_FORMATS } from '../../../utils/date-formats';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


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
    MatMomentDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ],
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
})
export class AssignTaskComponent {
  taskForm: FormGroup;
  employees = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams'];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      employee: ['', Validators.required],
      targetDate: ['', Validators.required],
      task: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      console.log('Task Assigned:', this.taskForm.value);
      alert('✅ Task assigned successfully!');
      this.taskForm.reset();
    }
  }
}
