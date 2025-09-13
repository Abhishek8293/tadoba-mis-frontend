import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-emp-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './emp-home.component.html',
  styleUrl: './emp-home.component.css'
})
export class EmpHomeComponent implements OnInit {

  // Dummy task stats (later fetch from backend)
  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;
  lateTasks: number = 0;

  ngOnInit(): void {
    // Dummy counts (replace with API later)
    const tasks = [
      { status: 'Pending' },
      { status: 'Completed' },
      { status: 'Late' },
      { status: 'Completed' },
      { status: 'Pending' },
      { status: 'Late' },
      { status: 'Pending' },
      { status: 'Completed' },
      { status: 'Late' },
      { status: 'Completed' },
      { status: 'Pending' },
      { status: 'Late' },
      { status: 'Pending' },
      { status: 'Completed' },
      { status: 'Late' },
      { status: 'Completed' },
      { status: 'Pending' },
      { status: 'Late' },
      { status: 'Pending' },
      { status: 'Completed' },
      { status: 'Late' },
      { status: 'Completed' },
      { status: 'Pending' },
      { status: 'Late' },
    ];

    this.totalTasks = tasks.length;
    this.completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    this.pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    this.lateTasks = tasks.filter((t) => t.status === 'Late').length;
  }

}
