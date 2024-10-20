import { IApparatus } from './apparatus.interface';
import { ITest } from './test.interface';
import { IUser } from './user.interface';

export interface IStock {
  id?: number;
  user_id: number;
  user?: IUser;
  type: string;
  createdAt?: Date;
}

export interface IStockIn {
  id?: number;
  apparatus_id: number;
  apparatus?: IApparatus;
  stock_id: number;
  stock?: IStock;
  quantity: number;
  createdAt?: Date;
}

export interface IStockOut {
  id?: number;
  apparatus_id: number;
  apparatus?: IApparatus;
  stock_id: number;
  stock?: IStock;
  test_id: number;
  test?: ITest;
  quantity: number;
  createdAt?: Date;
}
