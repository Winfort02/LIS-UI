import { AdjustmentType } from '../enums/common.enum';
import { IApparatus } from './apparatus.interface';
import { IUser } from './user.interface';

export interface IAdjustment {
  id?: number;
  user_id: number;
  user?: IUser;
  apparatus_id: number;
  apparatus?: IApparatus;
  quantity: number;
  type: AdjustmentType;
  remarks: string;
  createdAt?: Date;
}
