import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { StockIn } from '../../../models/stock.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Message } from 'primeng/api';
import { Pagination } from '../../../models/pagination.model';
import { ButtonLabel } from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { StockService } from '../../../services/stock.service';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-stock-int-list',
  standalone: true,
  imports: [
    SearchComponent,
    FeatureTableComponent,
    FeatureHeaderComponent,
    MessagesModule,
  ],
  templateUrl: './stock-int-list.component.html',
  styleUrl: './stock-int-list.component.scss',
  providers: [StockService],
})
export class StockIntListComponent implements OnInit {
  stocks = signal<StockIn[]>([]);
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
    edit: false,
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
      { field: 'received_by', header: 'Received By' },
      { field: 'apparatus_name', header: 'Apparatus Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'unit', header: 'Unit' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  getStockOutList(page: number) {
    this.stockSubsction = this.stockService
      .getAllStockIncoming(page, this.size, this.keywords())
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
