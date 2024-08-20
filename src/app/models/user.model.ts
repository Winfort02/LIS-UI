import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
  id?: number | undefined;
  name!: string;
  email!: string;
  role!: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
