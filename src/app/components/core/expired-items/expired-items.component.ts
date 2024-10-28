import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import {
  ActionButtonType,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpireItemService } from '../../../services/expire-item.service';
import { ExpiredItemFormComponent } from '../../shared/expired-item-form/expired-item-form.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { ExpiredItems } from '../../../models/expired-items.model';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';

@Component({
  selector: 'app-expired-items',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureHeaderComponent,
    SearchComponent,
    FeatureTableComponent,
  ],
  templateUrl: './expired-items.component.html',
  styleUrl: './expired-items.component.scss',
  providers: [DialogService, ExpireItemService],
})
export class ExpiredItemsComponent implements OnInit {
  messages: Message[] = [];
  stocks = signal<ExpiredItems[]>([]);
  cols = signal<ITableColumn[]>([]);
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
    delete: true,
  };
  stockSubsction!: Subscription;
  dialogRef!: DynamicDialogRef;
  commonHelper = new CommonHelper<ExpiredItems>();

  constructor(
    private dialogService: DialogService,
    private expiredItemService: ExpireItemService,
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      this.stockSubsction && this.stockSubsction.unsubscribe();
      this.getAllExpiredItems(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(ExpiredItemFormComponent, {
        ...this.commonHelper.commonDialogOption(),
        header: 'EXPIRED ITEM',
        contentStyle: { overflow: 'visible' },
      });

      this.dialogRef.onClose.subscribe((res: CustomResponse<ExpiredItems>) => {
        if (res && res?.message) {
          this.messages = res?.message || [];
        }
      });
    }
  }

  getAllExpiredItems(page: number) {
    this.expiredItemService
      .getAllExpiredItems(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.stocks.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err);
        },
      });
  }

  onLoadColums() {
    this.cols.set([
      { field: 'apparatus_name', header: 'Apparatus Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'unit', header: 'Unit' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'encoded_by', header: 'Encoded By' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.getAllExpiredItems(this.pagination().firstPage);
    if (event === EPagination.next)
      this.getAllExpiredItems(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.getAllExpiredItems(this.pagination().prevPage);
    if (event === EPagination.last)
      this.getAllExpiredItems(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: any) {
    switch (event.type) {
      case ActionButtonType.edit:
        this.dialogRef = this.dialogService.open(ExpiredItemFormComponent, {
          ...this.commonHelper.commonDialogOption(event.data),
          header: 'UPDATE FORM',
          contentStyle: { overflow: 'visible' },
        });
        this.dialogRef.onClose.subscribe(
          (res: CustomResponse<ExpiredItems>) => {
            if (res && res?.message) {
              this.messages = res.message;
              this.getAllExpiredItems(this.pagination().currentPage);
            }
          }
        );
        break;
      case ActionButtonType.delete:
        this.confirmationService.confirm({
          ...this.commonHelper.commonConfrimation(),
          header: 'Delete Confirmation',
          message: 'Are you sure you want to delete this item?',
          acceptLabel: 'Yes',
          accept: () => {
            this.expiredItemService.deleteExpiredItem(event.data.id).subscribe({
              next: () => {
                this.messages = [
                  { severity: 'info', summary: 'Deleted successfully' },
                ];
              },
              error: (err) => {
                this.messages = [
                  { severity: 'danger', summary: 'Unable to delete item' },
                ];
                throw new Error(err);
              },
            });
          },
        });
    }
  }
}
