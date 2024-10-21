import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Stock, StockIn, StockOut } from '../../../models/stock.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-item',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './stock-item.component.html',
  styleUrl: './stock-item.component.scss',
})
export class StockItemComponent implements OnInit {
  stock = new Stock();
  items: StockIn[] | StockOut[] = [];

  constructor(private dialogConfig: DynamicDialogConfig) {}

  ngOnInit(): void {
    if (this.dialogConfig.data) {
      this.stock = this.dialogConfig.data as Stock;
      this.onLoadItems();
    }
  }

  onLoadItems() {
    switch (this.stock.type.toLocaleLowerCase()) {
      case 'stock in':
        this.items = this.stock.stock_in;
        break;
      case 'stock out':
        this.items = this.stock.stock_out;
        break;
    }
  }

  get totalQuantity(): number {
    return this.items.reduce((curr, acc) => curr + acc.quantity, 0);
  }
}
