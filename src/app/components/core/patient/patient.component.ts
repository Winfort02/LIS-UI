import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { Patient } from '../../../models/patient.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { PatientService } from '../../../services/patient.service';
import {
  ActionButtonType,
  ButtonLabel,
  EPagination,
} from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonHelper } from '../../../helpers/common.helper';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [FeatureHeaderComponent, SearchComponent, FeatureTableComponent],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  providers: [PatientService],
})
export class PatientComponent implements OnInit, OnDestroy {
  patients = signal<Patient[]>([]);
  cols = signal<ITableColumn[]>([]);
  pagination = signal<Pagination>(new Pagination());
  keywords = signal<string>('');
  size = 25;
  selectedPage = signal<number>(1);
  patientSubscriptions!: Subscription;
  commonHelper = new CommonHelper<Patient>();
  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.DELETE,
  };

  constructor(
    private patientService: PatientService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      this.onLoadPatients(this.selectedPage());
    });
  }

  ngOnInit(): void {
    this.onLoadTableColumn();
  }

  ngOnDestroy(): void {
    this.patientSubscriptions && this.patientSubscriptions.unsubscribe();
  }

  onLoadTableColumn() {
    this.cols.set([
      { field: 'last_name', header: 'Last Name' },
      { field: 'first_name', header: 'First Name' },
      { field: 'middle_name', header: 'Middle Name' },
      { field: 'contact_number', header: 'Contact #' },
      { field: 'date_of_birth', header: 'Birthday' },
      { field: 'createdAt', header: 'Created Date' },
    ]);
  }

  onLoadPatients(page: number) {
    this.getAllPatients(page);
  }

  getAllPatients(page: number) {
    this.patientSubscriptions = this.patientService
      .getPatients(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.patients.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err);
        },
      });
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.onLoadPatients(this.pagination().firstPage);
    if (event === EPagination.next)
      this.onLoadPatients(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.onLoadPatients(this.pagination().prevPage);
    if (event === EPagination.last)
      this.onLoadPatients(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.selectedPage.set(event);
  }

  onClickActionBtn(event: { type: string; data: any }) {
    if (event.type === ActionButtonType.edit) {
      this.router.navigate(['application/patient/detail/' + event.data.id]);
    } else if (event.type === ActionButtonType.delete) {
      this.confirmationService.confirm({
        ...this.commonHelper.commonConfrimation(),
        accept: () => {
          this.deletePatient(event.data.id);
        },
      });
    }
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.router.navigate([`application/patient/detail/0`]);
    }
  }

  deletePatient(id: number) {
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'Record Deleted',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          detail: err.error.message,
        });
      },
      complete: () => {
        this.onLoadPatients(this.pagination().currentPage);
      },
    });
  }
}
