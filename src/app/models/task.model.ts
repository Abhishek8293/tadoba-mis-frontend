import { TaskStatus } from './task.enum';

export interface TaskRequestDTO {
  task?: string;
  description?: string;
  targetDate?: string;
  submissionDate?: string;
  employeeId?: number;
  empRating?: number;
  adminRating?: number;
  adminRemarks?: string;
}

export interface TaskResponseDTO {
  id: number;
  task: string;
  description: string;
  targetDate: string;
  submissionDate?: string;
  status: TaskStatus;
  employeeId: number;
  employeeName: string;
  assignedDate: string;
  empRating: number;
  adminRating: number;
  adminRemarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatusCountDTO {
  total: number;
  completed: number;
  pending: number;
  late: number;
  overdue: number;
}
