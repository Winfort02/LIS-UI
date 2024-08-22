export interface IStrategyMapping<T> {
  createdAtMapping(data: T[]): T[];

  dobMapping(data: [T]): T[];

  dobSingleMapping(data: T): T;

  singleMapping(data: T): T;
}
