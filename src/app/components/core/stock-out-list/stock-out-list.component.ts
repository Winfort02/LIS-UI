import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { StockOut } from '../../../models/stock.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { ButtonLabel } from '../../../enums/common.enum';
import { StockService } from '../../../services/stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-out-list',
  standalone: true,
  imports: [
    SearchComponent,
    FeatureTableComponent,
    FeatureHeaderComponent,
    MessagesModule,
  ],
  templateUrl: './stock-out-list.component.html',
  styleUrl: './stock-out-list.component.scss',
  providers: [StockService],
})
export class StockOutListComponent implements OnInit {
  stocks = signal<StockOut[]>([]);
  cols = signal<ITableColumn[]>([]);
  messages: Message[] = [];
  pagination = signal<Pagination>(new Pagination());
  selectedPage = signal<number>(1);
  size = 25;
  keywords = signal<string>('');
  actionButton = {
    edit: ButtonLabel.EDIT,
    delete: ButtonLabel.DELETE,
  };
  showActionBtn = {
    edit: true,
    delete: false,
  };
  stockSubsction!: Subscription;
  constructor(private stockService: StockService) {
    effect(() => {
      if (this.stockSubsction) this.stockSubsction.unsubscribe();
      this.getStockOutList(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  onLoadColums() {
    this.cols.set([
      { field: 'transaction_no', header: 'Transaction Number' },
      { field: 'apparatus_name', header: 'Apparatus Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'test_type', header: 'Test Type' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  getStockOutList(page: number) {
    this.stockSubsction = this.stockService
      .getAllStockOut(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.stocks.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  onSearch(event: string) {}
  onPaginatePage(event: string) {}
  onPageChange(event: number) {}
  onClickActionBtn(event: any) {}
}
