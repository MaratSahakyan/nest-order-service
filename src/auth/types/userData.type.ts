import { RolesEnum } from 'src/users/enums/roles.enum';

export class UserDataType {
  id: string;
  username: string;
  role: RolesEnum;
  createdAt: Date;
  updatedAt: Date;
}
