import { Component, effect, OnInit, signal, untracked } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import {
  ActionButtonType,
  ApplicationUrl,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonHelper } from '../../../helpers/common.helper';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Urinalysis } from '../../../models/urinalysis.model';
import { Pagination } from '../../../models/pagination.model';
import { UrinalysisService } from '../../../services/urinalysis.service';
import { Subscription } from 'rxjs';
import { UrinalysisFormComponent } from '../../shared/urinalysis-form/urinalysis-form.component';
import { CustomResponse } from '../../../models/response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-urinalysis',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureHeaderComponent,
    SearchComponent,
    FeatureTableComponent,
  ],
  templateUrl: './urinalysis.component.html',
  styleUrl: './urinalysis.component.scss',
  providers: [DialogService],
})
export class UrinalysisComponent implements OnInit {
  messages: Message[] = [];
  commonHelper = new CommonHelper<any>();
  size = 25;
  keywords = signal<string>('');
  cols = signal<ITableColumn[]>([]);
  urinalysis = signal<Urinalysis[]>([]);
  pagination = signal<Pagination>(new Pagination());
  urinalysisSubscription!: Subscription;
  selectedPage = signal<number>(1);

  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.VIEW,
  };
  showActionBtn = {
    edit: true,
    delete: false,
  };

  private dialogRef!: DynamicDialogRef;
  constructor(
    private dialogService: DialogService,
    private urinalysisService: UrinalysisService,
    private router: Router
  ) {
    effect(() => {
      if (this.urinalysisSubscription)
        this.urinalysisSubscription.unsubscribe();
      this.loadUrinalysis(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  onLoadColums() {
    this.cols.set([
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'physician', header: 'Physician' },
      { field: 'lab_no', header: 'Lab Number' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(
        UrinalysisFormComponent,
        this.commonHelper.urinalysisDialog()
      );

      this.dialogRef.onClose.subscribe(
        (response: CustomResponse<Urinalysis>) => {
          if (response) {
            this.messages = response.message;
            this.loadUrinalysis(this.pagination().currentPage);
          }
        }
      );
    }
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  loadUrinalysis(page: number) {
    this.urinalysisService
      .getAllUrinalysis(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.urinalysis.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  onPaginatePage(event: any) {
    switch (event) {
      case EPagination.first:
        this.loadUrinalysis(this.pagination().firstPage);
        break;
      case EPagination.next:
        this.loadUrinalysis(this.pagination().nextPage);
        break;
      case EPagination.prev:
        this.loadUrinalysis(this.pagination().prevPage);
        break;
      case EPagination.last:
        this.loadUrinalysis(this.pagination().lastPage);
        break;
    }
  }

  onPageChange(event: any) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: any) {
    switch (event.type) {
      case ActionButtonType.edit:
        this.router.navigate([
          `${ApplicationUrl.URINALYSIS_DETAIL}/detail/${event.data.id}`,
        ]);
        break;
    }
  }
}
