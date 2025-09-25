import { Role } from "./role.enum";

export interface ChangePasswordDTO {
  id: number;
  userType: Role;
  oldPassword: string;
  newPassword: string;
}
