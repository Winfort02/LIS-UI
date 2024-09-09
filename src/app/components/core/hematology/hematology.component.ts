import {
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { HematologyService } from '../../../services/hematology.service';

import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { Hematology } from '../../../models/hematology.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { Subscription } from 'rxjs';
import {
  ActionButtonType,
  ApplicationUrl,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonHelper } from '../../../helpers/common.helper';
import { HematologyFormComponent } from '../../shared/hematology-form/hematology-form.component';
import { CustomResponse } from '../../../models/response.model';

@Component({
  selector: 'app-test-order',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureHeaderComponent,
    SearchComponent,
    FeatureTableComponent,
    HematologyFormComponent,
  ],
  templateUrl: './hematology.component.html',
  styleUrl: './hematology.component.scss',
  providers: [DialogService],
})
export class HematologyComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  hematologies = signal<Hematology[]>([]);
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  hematologiesSubscription!: Subscription;
  size = 25;
  keywords = signal<string>('');
  selectedPage = signal<number>(1);
  commonHelper = new CommonHelper<Hematology>();
  actionButton = {
    edit: ButtonLabel.EDIT,
    delete: ButtonLabel.VIEW,
  };

  private dialogRef!: DynamicDialogRef;

  constructor(
    private hemotologyService: HematologyService,
    private dialogService: DialogService,
    private router: Router
  ) {
    effect(() => {
      if (this.hematologiesSubscription)
        this.hematologiesSubscription.unsubscribe();
      this.onLoadHematologies(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  onLoadColums() {
    this.cols.set([
      { field: 'fullName', header: 'Patient' },
      { field: 'physician', header: 'Physician' },
      { field: 'lab_no', header: 'Lab Number' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(
        HematologyFormComponent,
        this.commonHelper.hemotologyDialog()
      );

      this.dialogRef.onClose.subscribe(
        (response: CustomResponse<Hematology>) => {
          if (response) {
            this.messages = response.message;
            this.onLoadHematologies(this.pagination().currentPage);
          }
        }
      );
    }
  }

  getAllHematologies(page: number) {
    this.hemotologyService
      .getAllHematologies(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.hematologies.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  onLoadHematologies(page: number) {
    this.getAllHematologies(page);
  }

  onSearch(event: any) {
    this.keywords.set(event);
  }

  onPaginatePage(event: any) {
    if (event === EPagination.first)
      this.onLoadHematologies(this.pagination().firstPage);
    if (event === EPagination.next)
      this.onLoadHematologies(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.onLoadHematologies(this.pagination().prevPage);
    if (event === EPagination.last)
      this.onLoadHematologies(this.pagination().lastPage);
  }

  onPageChange(event: any) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: any) {
    if (event.type === ActionButtonType.edit) {
      this.dialogRef = this.dialogService.open(
        HematologyFormComponent,
        this.commonHelper.hemotologyDialog(event.data as Hematology)
      );

      this.dialogRef.onClose.subscribe(
        (response: CustomResponse<Hematology>) => {
          if (response) {
            this.messages = response.message;
            this.onLoadHematologies(this.pagination().currentPage);
          }
        }
      );
    }

    if (event.type === ActionButtonType.delete) {
      this.router.navigate([
        `${ApplicationUrl.HEMATOLOGY_LIST}/detail/${event.data.id}`,
      ]);
    }
  }

  ngOnInit(): void {
    this.onLoadColums();
  }

  ngOnDestroy(): void {
    if (this.hematologiesSubscription)
      this.hematologiesSubscription.unsubscribe();
  }
}
