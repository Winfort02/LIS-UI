import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { SearchComponent } from '../../shared/search/search.component';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, Message } from 'primeng/api';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import {
  ActionButtonType,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdjustmentService } from '../../../services/adjustment.service';
import { AdjustmentFormComponent } from '../../shared/adjustment-form/adjustment-form.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { Adjustment } from '../../../models/adjustment.model';
import { CustomResponse } from '../../../models/response.model';

@Component({
  selector: 'app-adjustment',
  standalone: true,
  imports: [
    FeatureHeaderComponent,
    FeatureTableComponent,
    SearchComponent,
    MessagesModule,
  ],
  templateUrl: './adjustment.component.html',
  styleUrl: './adjustment.component.scss',
  providers: [AdjustmentService, DialogService],
})
export class AdjustmentComponent implements OnInit {
  messages: Message[] = [];
  stocks = signal<any[]>([]);
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
  commonHelper = new CommonHelper<Adjustment>();

  constructor(
    private adjustmentService: AdjustmentService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      this.stockSubsction && this.stockSubsction.unsubscribe();
      this.getAllAdjustments(this.selectedPage());
      untracked(() => this.pagination());
    });
  }
  ngOnInit(): void {
    this.onLoadColums();
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(AdjustmentFormComponent, {
        ...this.commonHelper.commonDialogOption(),
        header: 'Stock Adjustment Form',
        contentStyle: { overflow: 'visible' },
      });

      this.dialogRef.onClose.subscribe((res: CustomResponse<Adjustment>) => {
        if (res && res?.message) {
          this.messages = res?.message || [];
          this.getAllAdjustments(this.pagination().currentPage);
        }
      });
    }
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }
  onLoadColums() {
    this.cols.set([
      { field: 'apparatus_name', header: 'Apparatus Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'unit', header: 'Unit' },
      { field: 'type', header: 'Type' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'encoded_by', header: 'Encoded By' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.getAllAdjustments(this.pagination().firstPage);
    if (event === EPagination.next)
      this.getAllAdjustments(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.getAllAdjustments(this.pagination().prevPage);
    if (event === EPagination.last)
      this.getAllAdjustments(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: any) {
    switch (event.type) {
      case ActionButtonType.edit:
        this.dialogRef = this.dialogService.open(AdjustmentFormComponent, {
          ...this.commonHelper.commonDialogOption(event.data),
          header: 'Stock Adjustment Form',
          contentStyle: { overflow: 'visible' },
        });
        this.dialogRef.onClose.subscribe((res: CustomResponse<Adjustment>) => {
          if (res && res?.message) {
            this.messages = res.message;
            this.getAllAdjustments(this.pagination().currentPage);
          }
        });
        break;
      case ActionButtonType.delete:
        this.confirmationService.confirm({
          ...this.commonHelper.commonConfrimation(),
          header: 'Delete Confirmation',
          message: 'Are you sure you want to delete this item?',
          acceptLabel: 'Yes',
          accept: () => {
            this.adjustmentService.deleteAdjustment(event.data.id).subscribe({
              next: () => {
                this.messages = [
                  { severity: 'info', summary: 'Deleted successfully' },
                ];
              },
              error: (err) => {
                this.messages = [
                  { severity: 'error', summary: 'Unable to delete item' },
                ];
                throw new Error(err);
              },
              complete: () => {
                this.getAllAdjustments(this.pagination().currentPage);
              },
            });
          },
        });
        break;
    }
  }

  getAllAdjustments(page: number) {
    this.adjustmentService
      .getAllAdjustments(page, this.size, this.keywords())
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
}
