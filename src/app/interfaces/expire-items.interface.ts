import { IApparatus } from './apparatus.interface';
import { IUser } from './user.interface';

export interface IExpiredItems {
  id?: number;
  user_id: number;
  user?: IUser;
  apparatus_id: number;
  apparatus?: IApparatus;
  quantity: number;
  status: boolean;
  remarks: string;
  createdAt?: Date;
}
