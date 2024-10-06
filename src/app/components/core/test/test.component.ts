import {
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { SearchComponent } from '../../shared/search/search.component';
import { Test } from '../../../models/test.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { Subscription } from 'rxjs';
import {
  ActionButtonType,
  ApplicationUrl,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { TestService } from '../../../services/test.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { TestFormComponent } from '../../shared/test-form/test-form.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { CustomResponse } from '../../../models/response.model';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    FeatureHeaderComponent,
    SearchComponent,
    FeatureTableComponent,
    MessagesModule,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  providers: [DialogService, TestService],
})
export class TestComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  test = signal<Test[]>([]);
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  keywords = signal<string>('');
  size = 25;
  selectedPage = signal<number>(1);
  testSubscription!: Subscription;

  actionButton = {
    edit: ButtonLabel.EDIT,
    delete: ButtonLabel.VIEW,
  };

  commonHelper = new CommonHelper<Test>();
  private dialogRef!: DynamicDialogRef;

  constructor(
    private testService: TestService,
    private dialogService: DialogService,
    private router: Router
  ) {
    effect(() => {
      this.testSubscription && this.testSubscription.unsubscribe();
      this.getTestRecords(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadTableColumn();
  }

  ngOnDestroy(): void {
    this.testSubscription && this.testSubscription.unsubscribe();
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(TestFormComponent, {
        ...this.commonHelper.commonDialogOption(),
        header: 'TEST CREATION FORM',
        contentStyle: { overflow: 'visible' },
      });

      this.dialogRef.onClose.subscribe((res: CustomResponse<Test>) => {
        this.messages = res?.message || [];
        const response = res?.response as Test;
        if (response && Object.entries(response)?.length) {
          this.router.navigate([
            `${ApplicationUrl.APPLICATION}/${ApplicationUrl.TEST}/transaction/${
              response.transaction_number
            }/${(response.type as String).toLocaleLowerCase()}`,
          ]);
        }
      });
    }
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onLoadTableColumn() {
    this.cols.set([
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'patientName', header: 'Patient' },
      { field: 'type', header: 'Test Type' },
      { field: 'createdAt', header: 'Created Date' },
    ]);
  }

  getTestRecords(page: number) {
    this.testSubscription = this.testService
      .getTestRecords(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.test.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err);
        },
      });
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.getTestRecords(this.pagination().firstPage);
    if (event === EPagination.next)
      this.getTestRecords(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.getTestRecords(this.pagination().prevPage);
    if (event === EPagination.last)
      this.getTestRecords(this.pagination().lastPage);
  }

  onPageChange(event: number) {}

  onClickActionBtn(event: { type: string; data: any }) {
    switch (event.type) {
      case ActionButtonType.delete:
        this.router.navigate([
          `${ApplicationUrl.APPLICATION}/${ApplicationUrl.TEST}/transaction/${
            event.data.transaction_number
          }/${(event.data.type as String).toLocaleLowerCase()}`,
        ]);
        break;
      case ActionButtonType.edit:
        this.dialogRef = this.dialogService.open(TestFormComponent, {
          ...this.commonHelper.commonDialogOption(event.data),
          header: 'TEST CREATION FORM',
          contentStyle: { overflow: 'visible' },
        });
        this.dialogRef.onClose.subscribe((res: CustomResponse<Test>) => {
          this.messages = res.message;
          this.getTestRecords(this.pagination().currentPage);
        });
        break;
    }
  }
}
