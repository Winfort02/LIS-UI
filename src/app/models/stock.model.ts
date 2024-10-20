import { IApparatus } from '../interfaces/apparatus.interface';
import { IStock, IStockIn, IStockOut } from '../interfaces/stock';
import { ITest } from '../interfaces/test.interface';
import { Apparatus } from './apparatus.model';
import { User } from './user.model';

export class Stock implements IStock {
  id?: number | undefined;
  user_id!: number;
  user?: User;
  type!: string;
  createdAt?: Date | undefined;
  stock_in!: StockIn[];
  stock_out!: StockOut[];
}

export class StockIn implements IStockIn {
  id?: number | undefined;
  apparatus_id!: number;
  apparatus?: Apparatus;
  stock_id!: number;
  stock_in?: Stock;
  quantity: number = 0;
  createdAt?: Date | undefined;
}

export class StockOut implements IStockOut {
  id?: number | undefined;
  apparatus_id!: number;
  apparatus?: IApparatus | undefined;
  stock_id!: number;
  stock?: IStock | undefined;
  test_id!: number;
  test?: ITest | undefined;
  quantity: number = 0;
  createdAt?: Date | undefined;
}
