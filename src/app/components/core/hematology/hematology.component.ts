import {
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { HematologyService } from '../../../services/hematology.service';
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
import { CommonHelper } from '../../../helpers/common.helper';

@Component({
  selector: 'app-test-order',
  standalone: true,
  imports: [FeatureHeaderComponent, SearchComponent, FeatureTableComponent],
  templateUrl: './hematology.component.html',
  styleUrl: './hematology.component.scss',
})
export class HematologyComponent implements OnInit, OnDestroy {
  hematologies = signal<Hematology[]>([]);
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  hematologiesSubscription!: Subscription;
  size = 25;
  keywords = signal<string>('');
  selectedPage = signal<number>(1);
  commonHelper = new CommonHelper<Hematology>();
  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.VIEW,
  };
  showActionBtn = {
    edit: true,
    delete: false,
  };

  constructor(
    private hemotologyService: HematologyService,
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
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'physician', header: 'Physician' },
      { field: 'lab_no', header: 'Lab Number' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'createdAt', header: 'Date' },
    ]);
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
