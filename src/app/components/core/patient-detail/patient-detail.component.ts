import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FeatureDetailHeaderComponent } from '../../shared/feature-detail-header/feature-detail-header.component';
import { PatientFormContainerComponent } from '../../shared/patient-form/patient-form-container.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { CommonSuccessResponse } from '../../../models/response.model';
import {
  ApplicationUrl,
  ButtonLabel,
  Severity,
  Icon,
  ButtonColor,
  EPagination,
  ActionButtonType,
} from '../../../enums/common.enum';
import { MESSAGES } from '../../../helpers/constant.helper';
import { CommonHelper } from '../../../helpers/common.helper';
import { TestService } from '../../../services/test.service';
import { Subscription } from 'rxjs';
import { Test } from '../../../models/test.model';
import { Pagination } from '../../../models/pagination.model';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FeatureDetailHeaderComponent,
    PatientFormContainerComponent,
    MessagesModule,
    FeatureTableComponent,
    SearchComponent,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  providers: [PatientService, TestService],
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private testService: TestService
  ) {}
  messages: Message[] = [];
  isInvalidForm!: boolean;
  patient = signal<Patient>(new Patient());
  editIconBtn = Icon.EDIT;
  editBtnLabel = ButtonLabel.EDIT;
  isEdit = signal<boolean>(false);
  editBtnSeverity = ButtonColor.INFO;
  paramsId = 0;
  commonHelper = new CommonHelper<Patient>();
  subsciptions: Subscription[] = [];
  showTestHistory = false;

  pagination = signal<Pagination>(new Pagination());
  keywords = signal<string>('');
  size = 10;
  selectedPage = signal<number>(1);
  tests = signal<Test[]>([]);
  cols = signal<ITableColumn[]>([]);

  actionButton = {
    edit: ButtonLabel.VIEW,
    delete: ButtonLabel.DELETE,
  };

  showActionBtn = {
    edit: true,
    delete: false,
  };

  toggleLock() {
    this.isEdit.set(!this.isEdit());
    this.editIconBtn = this.isEdit() ? Icon.EDIT : Icon.CANCEL;
    this.editBtnLabel = this.isEdit() ? ButtonLabel.EDIT : ButtonLabel.CANCEL;
    this.editBtnSeverity = this.isEdit()
      ? ButtonColor.INFO
      : ButtonColor.DANGER;
  }

  onSave(event: Patient) {
    if (!this.isEdit()) {
      if (this.paramsId === 0) {
        this.patientService.createPatient(event).subscribe({
          next: (response: CommonSuccessResponse<Patient>) => {
            const patient = response.data as Patient;
            this.router.navigate([ApplicationUrl.PATIENT_DETAIL + patient.id]);
            this.patient.set(patient);
            this.paramsId = patient.id as number;
            this.isEdit.set(true);
          },
          error: (err) => {
            this.messages = this.commonHelper.commonMessages(
              Severity.ERROR,
              err.error.message
            );
          },
          complete: () => {
            this.messages = this.commonHelper.commonMessages(
              Severity.INFO,
              MESSAGES.CREATED_PATIENT
            );
          },
        });
      } else {
        this.patientService.updatePatient(event).subscribe({
          next: (response: CommonSuccessResponse<Patient>) => {
            const patient = response.data as Patient;
            patient.date_of_birth = new Date(patient.date_of_birth);
            this.patient.set(patient);
            this.toggleLock();
          },
          error: (error) => {
            this.messages = this.commonHelper.commonMessages(
              Severity.ERROR,
              error.error.messages
            );
          },
          complete: () => {
            this.messages = this.commonHelper.commonMessages(
              Severity.INFO,
              MESSAGES.UPDATED_PATIENT
            );
          },
        });
      }
    }
  }

  onLoadPatienDetail() {
    if (this.paramsId) {
      this.toggleLock();
      const patientSub = this.patientService
        .getPatientById(this.paramsId)
        .subscribe({
          next: (response: CommonSuccessResponse<Patient>) => {
            this.patient.set(response.data as Patient);
          },
          error: (errors) => {
            if (errors.error.errors.statusCode === 404) {
              this.router.navigate([
                `${ApplicationUrl.APPLICATION}/${ApplicationUrl.PATIENTS}`,
              ]);
              return;
            }
          },
        });
      this.subsciptions.push(patientSub);
    }
  }

  onLoadColumn() {
    this.cols.set([
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'type', header: 'Test Type' },
      { field: 'isCompleted', header: 'Status' },
      { field: 'createdAt', header: 'Created Date' },
    ]);
  }

  onLoadPatientTestHistory(page: number) {
    const testHistorySubs = this.testService
      .getPatientTestHistory(this.paramsId, page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.tests.set(response.metaData);
        },
        error: (err) => {
          throw new Error(err);
        },
        complete: () => {
          this.onLoadColumn();
          this.showTestHistory = this.tests().length > 0;
        },
      });
    this.subsciptions.push(testHistorySubs);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.onLoadPatientTestHistory(this.pagination().firstPage);
    if (event === EPagination.next)
      this.onLoadPatientTestHistory(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.onLoadPatientTestHistory(this.pagination().prevPage);
    if (event === EPagination.last)
      this.onLoadPatientTestHistory(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.onLoadPatientTestHistory(event);
  }

  onClickActionBtn(event: { type: string; data: any }) {
    switch (event.type) {
      case ActionButtonType.edit:
        this.router.navigate([
          `${ApplicationUrl.APPLICATION}/${ApplicationUrl.TEST}/transaction/${
            event.data.transaction_number
          }/${(event.data.type as String).toLocaleLowerCase()}`,
        ]);
        break;
    }
  }

  onSearch(event: string) {
    this.keywords.set(event);
    this.onLoadPatientTestHistory(this.pagination().currentPage);
  }

  onTrack(event: boolean) {
    this.isInvalidForm = event;
  }

  ngOnInit(): void {
    this.paramsId = parseInt(this.route.snapshot.params['id']);
    this.onLoadPatienDetail();
    this.onLoadPatientTestHistory(this.pagination().currentPage);
  }

  ngOnDestroy(): void {
    if (this.subsciptions.length) {
      this.subsciptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
    }
  }
}
