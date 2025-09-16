import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface Task {
  id: number;
  task: string;
  description: string;
  assignedDate: Date;
  targetDate: Date;
  submissionDate?: Date | null;
  status: 'Pending' | 'Completed' | 'Late';
}

@Component({
  selector: 'app-emp-task-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './emp-task-view.component.html',
  styleUrl: './emp-task-view.component.css',
})
export class EmpTaskViewComponent {
  //
  @ViewChild('submitDialog') submitDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  // Simulated input task (later you can pass via routing or service)
  task: Task = {
    id: 1,
    task: 'Prepare Financial Report',
    description:
      'Compile all financial transactions for August and prepare the monthly report for review.',
    assignedDate: new Date('2025-08-30'),
    targetDate: new Date('2025-09-05'),
    submissionDate: null,
    status: 'Pending',
  };

  constructor(private dialog: MatDialog) {}

  openSubmitDialog() {
    this.dialogRef = this.dialog.open(this.submitDialogTemplate, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });
  }

  closeSubmitDialog() {
    this.dialogRef.close();
  }

  goBack() {
    // Navigate back to task list
    window.history.back();
  }

  submitTask() {
    alert('Task Submitted Successfully!');
  }
}
