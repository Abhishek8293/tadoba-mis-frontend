export interface ReportSummary {
  totalTasks: number;
  completed: number;
  pending: number;
  late: number;
  overdue: number;
  avgEmpRating: number;
  avgAdminRating: number;
  workPercentage: number;
  adminScorePercentage: number;
}

export interface ReportRequest {
  employeeId: number;
  month: number;
  year: number;
}

export interface EmployeeOption {
  id: number;
  name: string;
}
