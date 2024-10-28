import { IApparatus } from '../interfaces/apparatus.interface';
import { IExpiredItems } from '../interfaces/expire-items.interface';
import { IUser } from '../interfaces/user.interface';

export class ExpiredItems implements IExpiredItems {
  id?: number | undefined;
  user_id!: number;
  user?: IUser | undefined;
  apparatus_id!: number;
  apparatus?: IApparatus | undefined;
  quantity!: number;
  status!: boolean;
  remarks!: string;
  createdAt?: Date | undefined;
}
