import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AssignTaskComponent } from './pages/admin/assign-task/assign-task.component';
import { TasksComponent } from './pages/admin/tasks/tasks.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { EmployeeComponent } from './pages/admin/employee/employee.component';
import { EmpHomeComponent } from './pages/employee/emp-home/emp-home.component';
import { EmpTasksComponent } from './pages/employee/emp-tasks/emp-tasks.component';
import { EmpComponent } from './pages/employee/emp/emp.component';
import { LoginComponent } from './pages/login/login.component';
import { EmpProfileComponent } from './pages/employee/emp-profile/emp-profile.component';
import { EmpTaskViewComponent } from './pages/employee/emp-task-view/emp-task-view.component';
import { AdminTaskViewComponent } from './pages/admin/admin-task-view/admin-task-view.component';
import { DepartmentComponent } from './pages/admin/department/department.component';
import { authGuard } from './core/auth.guard';
import { NoticeComponent } from './pages/admin/notice/notice.component';
import { HighlightComponent } from './pages/admin/highlight/highlight.component';
import { EmployeeReportComponent } from './pages/admin/employee-report/employee-report.component';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    component: AdminComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'home', component: AdminHomeComponent },
      { path: 'assign-task', component: AssignTaskComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'task/:id', component: AdminTaskViewComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'notice', component: NoticeComponent },
      { path: 'highlight', component: HighlightComponent },
      { path: 'reports', component: EmployeeReportComponent },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['EMPLOYEE'] },
    component: EmpComponent,
    children: [
      { path: '', component: EmpHomeComponent },
      { path: 'tasks', component: EmpTasksComponent },
      { path: 'profile', component: EmpProfileComponent },
      { path: 'task/:id', component: EmpTaskViewComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];
