import { Role } from "./role.enum";

export interface EmployeeRequestDTO {
  name: string;
  email: string;
  password: string;
  departmentId: number;
  dob: string; 
  responsibilities: string;
}

export interface EmployeeResponseDTO {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
  dob: string;  
  responsibilities: string;
  role: Role;
  createdAt: string; 
  updatedAt: string;
}