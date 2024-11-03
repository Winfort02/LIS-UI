import { AdjustmentType } from '../enums/common.enum';
import { IAdjustment } from '../interfaces/adjustment.interface';
import { Apparatus } from './apparatus.model';
import { User } from './user.model';

export class Adjustment implements IAdjustment {
  id?: number | undefined;
  user_id!: number;
  user?: User | undefined;
  apparatus_id!: number;
  apparatus?: Apparatus | undefined;
  quantity!: number;
  type!: AdjustmentType;
  remarks!: string;
  createdAt?: Date | undefined;
}
