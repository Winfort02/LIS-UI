import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  untracked,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { ButtonModule } from 'primeng/button';
import { Pagination } from '../../../models/pagination.model';
import { CommonModule } from '@angular/common';
import { ButtonLabel } from '../../../enums/common.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feature-table',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './feature-table.component.html',
  styleUrl: './feature-table.component.scss',
})
export class FeatureTableComponent implements OnInit {
  @Input() cols = signal<ITableColumn[]>([]);
  @Input() items = signal<any[]>([]);
  @Input() loading: boolean = false;
  @Input() pagination = signal<Pagination>(new Pagination());
  @Input() enablePagination: Boolean = false;
  @Input() actionButton: { edit: string; delete: string } = {
    edit: ButtonLabel.EDIT,
    delete: ButtonLabel.DELETE,
  };

  @Output() paginatePage = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() maxRowChange = new EventEmitter<any>();
  @Output() actionBtn = new EventEmitter<{ type: string; data: any }>();

  pageSize = 5;
  pageNumbers: number[] = [];
  end = 5;
  getUsers = computed(() => this.items());
  getColumns = computed(() => this.cols());
  getPagination = computed(() => this.pagination());

  constructor(private spinner: NgxSpinnerService) {
    this.spinner.show();
    effect(() => {
      this.updatePageNumbers();
      untracked(() => this.pagination());
      untracked(() => this.cols());
      untracked(() => this.items());
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  onPaginatePage(page: string) {
    this.paginatePage.emit(page);
  }

  onPageChange(page: number) {
    this.pageChanged.emit(page);
    this.updatePageNumbers();
  }

  onClickActionBtn(type: string, data: any) {
    const response = { type, data };
    this.actionBtn.emit(response);
  }

  updatePageNumbers() {
    let start;
    this.pageNumbers = [];
    if (
      this.getPagination().currentPage >
      this.getPagination().totalPages - 4
    ) {
      start = Math.max(1, this.getPagination().totalPages - 4);
    } else {
      start = Math.max(1, this.getPagination().currentPage - 2);
    }
    const end = Math.min(
      start + this.pageSize - 1,
      this.getPagination().totalPages
    );
    for (let i = start; i <= end; i++) {
      this.pageNumbers.push(i);
    }
  }

  ngOnInit(): void {}
}
