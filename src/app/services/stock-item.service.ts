import { Injectable } from '@angular/core';
import { StockIn } from '../models/stock.model';
import { BehaviorSubject } from 'rxjs';
import { StockItem } from '../models/stock-item.model';
import { IStockOut } from '../interfaces/stock';

@Injectable({
  providedIn: 'root',
})
export class StockItemService {
  private items = new BehaviorSubject<StockItem>({
    stocks: this.getStocksFormLocalStorage(),
  });
  stocks = this.items.asObservable();

  constructor() {}

  addItem(item: StockIn, quantity: number = 1): void {
    const stocks = [...this.items.value.stocks];
    const stockItem = stocks.find(
      (_item) => _item.apparatus_id === item.apparatus_id
    );
    if (stockItem) stockItem.quantity += quantity;
    else stocks.push(item);
    this.items.next({ stocks });
    this.setStocksToLocalStorage();
  }

  private setStocksToLocalStorage(): void {
    const cartJson = JSON.stringify(this.items.value.stocks);
    localStorage.setItem('stocks', cartJson);
    this.items.next({ stocks: this.items.value.stocks });
  }

  private getStocksFormLocalStorage(): Array<StockIn | IStockOut> {
    const stockJson = localStorage.getItem('stocks');
    return stockJson ? JSON.parse(stockJson) : [];
  }

  removeQty(item: StockIn | IStockOut): void {
    let itemTobeRemove: StockIn | IStockOut | undefined;
    let filteredItems = this.items.value.stocks.map((_item) => {
      if (_item.apparatus_id === item.apparatus_id) _item.quantity--;
      if (_item.quantity === 0) itemTobeRemove = _item;
      return _item;
    });

    if (itemTobeRemove)
      filteredItems = this.removeFromCart(itemTobeRemove, false);
    this.items.next({ stocks: filteredItems });
    this.setStocksToLocalStorage();
  }

  removeFromCart(
    item: StockIn | IStockOut,
    update = true
  ): Array<StockIn | IStockOut> {
    const filteredItems = this.items.value.stocks.filter(
      (_item) => _item.apparatus_id !== item.apparatus_id
    );
    if (update) {
      this.items.next({ stocks: filteredItems });
      this.setStocksToLocalStorage();
    }
    return filteredItems;
  }

  onClearCart(): void {
    this.items.next({ stocks: [] });
    this.setStocksToLocalStorage();
  }

  getTotalQuantiy(items: Array<StockIn | IStockOut>): number {
    return items
      .map((item) => item.quantity)
      .reduce((prev, curr) => prev + curr, 0);
  }
}
