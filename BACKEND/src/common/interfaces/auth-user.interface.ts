import { $Enums } from '../../../generated/prisma';
import UserRole = $Enums.UserRole;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
