import { TaskStatus } from "./task.enum";

export interface TaskRequestDTO {
  task: string;
  description: string;
  targetDate: string;
  submissionDate?: string;
  employeeId: number;
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
  createdAt: string;
  updatedAt: string;
}
