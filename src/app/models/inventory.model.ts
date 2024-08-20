import { IInventory } from '../interfaces/inventory.interface';

export class Inventory implements IInventory {
  id?: number | undefined;
  item!: string;
  item_type!: string;
  item_description!: string;
  quantity_in_stock!: number;
  reorder_level!: number;
  storage_location!: number;
}
