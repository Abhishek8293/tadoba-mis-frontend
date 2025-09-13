import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AssignTaskComponent } from './pages/admin/assign-task/assign-task.component';
import { TasksComponent } from './pages/admin/tasks/tasks.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { EmployeeComponent } from './pages/admin/employee/employee.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'home', component: AdminHomeComponent },
      { path: 'assign-task', component: AssignTaskComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'employee', component: EmployeeComponent },
    ],
  },
];
