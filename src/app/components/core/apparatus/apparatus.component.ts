import {
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { Apparatus } from '../../../models/apparatus.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { ActionButtonType, ButtonLabel } from '../../../enums/common.enum';
import { ApparatusService } from '../../../services/apparatus.service';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApparatusFormComponent } from '../../shared/apparatus-form/apparatus-form.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { CustomResponse } from '../../../models/response.model';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    SearchComponent,
    FeatureHeaderComponent,
    FeatureTableComponent,
    MessagesModule,
  ],
  templateUrl: './apparatus.component.html',
  styleUrl: './apparatus.component.scss',
  providers: [ApparatusService, DialogService],
})
export class ApparatusComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  apparatus = signal<Apparatus[]>([]);
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
    delete: false,
  };

  apparatusSubscription!: Subscription;
  dialogRef!: DynamicDialogRef;
  commonHelper = new CommonHelper<Apparatus>();

  constructor(
    private apparatusService: ApparatusService,
    private dialogService: DialogService
  ) {
    effect(() => {
      if (this.apparatusSubscription) this.apparatusSubscription.unsubscribe();
      this.getAllApparatus(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  ngOnDestroy(): void {
    this.apparatusSubscription && this.apparatusSubscription.unsubscribe();
  }

  onInitializeApparatusForm(data?: Apparatus) {
    this.dialogRef = this.dialogService.open(ApparatusFormComponent, {
      ...this.commonHelper.commonDialogOption(data),
      header: 'Apparatus Form',
      contentStyle: { overflow: 'visible' },
    });
    this.dialogRef.onClose.subscribe((response: CustomResponse<Apparatus>) => {
      if (response) {
        this.messages = response.message;
        this.getAllApparatus(this.pagination().currentPage);
      }
    });
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.onInitializeApparatusForm();
    }
  }

  onLoadColums() {
    this.cols.set([
      { field: 'apparatus_name', header: 'Apparatus Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'unit', header: 'Unit' },
      { field: 'availability', header: 'Availability' },
      { field: 'isExpired', header: 'Status' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  getAllApparatus(page: number) {
    this.apparatusSubscription = this.apparatusService
      .getAllAppratus(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.apparatus.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onPaginatePage(event: string) {}

  onPageChange(event: number) {}

  onClickActionBtn(event: any) {
    if (event.type === ActionButtonType.edit) {
      const data = event.data as Apparatus;
      this.onInitializeApparatusForm(data);
    }
  }
}
