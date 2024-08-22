export interface IUser {
  id?: number;
  name: string;
  email: string;
  role: string;
  createdAt?: Date | string;
  updatedAt?: Date;
}
