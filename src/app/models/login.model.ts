import { Role } from './role.enum';

export interface LoginDTO {
  userType: Role;
  email: string;
  password: string;
  id?: number;
  name?: string;
}
