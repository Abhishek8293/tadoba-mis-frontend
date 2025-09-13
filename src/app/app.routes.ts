import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AssignTaskComponent } from './pages/admin/assign-task/assign-task.component';
import { TasksComponent } from './pages/admin/tasks/tasks.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { EmployeeComponent } from './pages/admin/employee/employee.component';
import { EmpHomeComponent } from './pages/employee/emp-home/emp-home.component';
import { EmpTasksComponent } from './pages/employee/emp-tasks/emp-tasks.component';
import { EmpComponent } from './pages/employee/emp/emp.component';

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
  {
    path: '',
    component: EmpComponent,
    children: [
      { path: '', component: EmpHomeComponent },
      { path: 'tasks', component: EmpTasksComponent },
    ],
  },
];
