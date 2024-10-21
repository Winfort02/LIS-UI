import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { Message } from 'primeng/api';
import { Stock } from '../../../models/stock.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import {
  ActionButtonType,
  ButtonLabel,
  StockMode,
} from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { StockService } from '../../../services/stock.service';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StockItemComponent } from '../../shared/stock-item/stock-item.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { CustomResponse } from '../../../models/response.model';

@Component({
  selector: 'app-stock-in',
  standalone: true,
  imports: [
    MessagesModule,
    SearchComponent,
    FeatureHeaderComponent,
    FeatureTableComponent,
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  providers: [StockService, DialogService],
})
export class StockComponent implements OnInit {
  messages: Message[] = [];
  stock = signal<Stock[]>([]);
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  selectedPage = signal<number>(1);
  size = 25;
  keywords = signal<string>('');
  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.DELETE,
  };
  showActionBtn = {
    edit: true,
    delete: false,
  };

  stockSubsction!: Subscription;
  dialogRef!: DynamicDialogRef;
  commonHelper = new CommonHelper<Stock>();

  constructor(
    private stockService: StockService,
    private router: Router,
    private dialogService: DialogService
  ) {
    effect(() => {
      if (this.stockSubsction) this.stockSubsction.unsubscribe();
      this.getStockInList(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  onLoadColums() {
    this.cols.set([
      { field: 'user_name', header: 'Encoded By' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'number_of_items', header: 'Total Items' },
      { field: 'type', header: 'Type' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  getStockInList(page: number) {
    this.stockSubsction = this.stockService
      .getAllStockIn(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.stock.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  add(event: string) {
    this.router.navigate(['application/stock-item/stocks']);
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onPaginatePage(event: string) {}

  onPageChange(event: number) {}

  onClickActionBtn(event: any) {
    if (event.type === ActionButtonType.edit) {
      this.dialogRef = this.dialogService.open(StockItemComponent, {
        ...this.commonHelper.commonDialogOption(event.data),
        header: `Stock ${event?.data?.type || ' '} Items`.toLocaleUpperCase(),
        width: '65%',
      });
    }
  }
}
