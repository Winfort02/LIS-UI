import {
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { SearchComponent } from '../../shared/search/search.component';
import { Chemistry } from '../../../models/chemistry.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import {
  ActionButtonType,
  ApplicationUrl,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { Router } from '@angular/router';
import { ChemistryService } from '../../../services/chemistry.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chemistry',
  standalone: true,
  imports: [FeatureHeaderComponent, FeatureTableComponent, SearchComponent],
  templateUrl: './chemistry.component.html',
  styleUrl: './chemistry.component.scss',
  providers: [ChemistryService],
})
export class ChemistryComponent implements OnInit, OnDestroy {
  chemistry = signal<Chemistry[]>([]);
  chemistrySubscription!: Subscription;
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  selectedPage = signal<number>(1);
  size = 25;
  keywords = signal<string>('');
  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.VIEW,
  };
  showActionBtn = {
    edit: true,
    delete: false,
  };

  constructor(
    private router: Router,
    private chemistryService: ChemistryService
  ) {
    effect(() => {
      if (this.chemistrySubscription) this.chemistrySubscription.unsubscribe();
      this.getAllChemistry(this.selectedPage());
      untracked(() => this.pagination());
    });
  }

  ngOnInit(): void {
    this.onLoadColums();
  }
  ngOnDestroy(): void {
    this.chemistrySubscription && this.chemistrySubscription.unsubscribe();
  }

  getAllChemistry(page: number) {
    this.chemistryService
      .getAllChemistry(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.chemistry.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err.error);
        },
      });
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onLoadColums() {
    this.cols.set([
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'physician', header: 'Physician Name' },
      { field: 'lab_no', header: 'Lab Number' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'createdAt', header: 'Date' },
    ]);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.getAllChemistry(this.pagination().firstPage);
    if (event === EPagination.next)
      this.getAllChemistry(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.getAllChemistry(this.pagination().prevPage);
    if (event === EPagination.last)
      this.getAllChemistry(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: any) {
    if (event.type === ActionButtonType.edit) {
      this.router.navigate([
        `${ApplicationUrl.CHEMSTRY_LIST}/detail/${event.data.id}`,
      ]);
    }
  }
}
