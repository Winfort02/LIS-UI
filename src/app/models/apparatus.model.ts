import { IApparatus } from '../interfaces/apparatus.interface';

export class Apparatus implements IApparatus {
  id?: number | undefined;
  apparatus_name!: string;
  unit!: string;
  quantity!: number;
  status!: boolean;
  createdAt?: Date | undefined;
}
