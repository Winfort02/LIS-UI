import { IInventory } from '../interfaces/inventory.interface';
import { IUsageLog } from '../interfaces/user-logs.interface';
import { IUser } from '../interfaces/user.interface';

export class UserLog implements IUsageLog {
  id?: number | undefined;
  user!: IUser;
  user_id!: number;
  inventory!: IInventory;
  inventory_id!: number;
  quantity_used!: number;
  date_of_use!: Date;
  purpose_of_use!: string;
}
