import { IInventory } from './inventory.interface';
import { IUser } from './user.interface';

export interface IUsageLog {
  id?: number;
  user: IUser;
  user_id: number;
  inventory: IInventory;
  inventory_id: number;
  quantity_used: number;
  date_of_use: Date;
  purpose_of_use: string;
}
