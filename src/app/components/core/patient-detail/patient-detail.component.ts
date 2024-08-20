import { Component, OnInit, signal } from '@angular/core';
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
} from '../../../enums/common.enum';
import { MESSAGES } from '../../../helpers/constant.helper';
import { CommonHelper } from '../../../helpers/common.helper';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FeatureDetailHeaderComponent,
    PatientFormContainerComponent,
    MessagesModule,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  providers: [PatientService],
})
export class PatientDetailComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}
  messages: Message[] = [];
  isInvalidForm!: boolean;
  patient = signal<Patient>(new Patient());
  lockIconBtn = Icon.LOCK;
  lockBtnLabel = ButtonLabel.LOCK;
  isLock = signal<boolean>(false);
  paramsId = parseInt(this.route.snapshot.params['id']);
  commonHelper = new CommonHelper<Patient>();

  onBack() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate([ApplicationUrl.PATIENT_LIST]);
      this.spinner.hide();
    }, 1000);
  }

  toggleLock() {
    this.isLock.set(!this.isLock());
    this.lockIconBtn = this.isLock() ? Icon.LOCK : Icon.OPEN_LOCK;
    this.lockBtnLabel = this.isLock() ? ButtonLabel.LOCK : ButtonLabel.UNLOCK;
  }

  onSave(event: Patient) {
    if (!this.isLock()) {
      if (this.paramsId === 0) {
        this.patientService.createPatient(event).subscribe({
          next: (response: CommonSuccessResponse<Patient>) => {
            const patient = response.data as Patient;
            this.router.navigate([ApplicationUrl.PATIENT_DETAIL + patient.id]);
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
          next: (response: Patient) => {
            this.patient.set(response);
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
      this.patientService.getPatientById(this.paramsId).subscribe({
        next: (response: Patient) => {
          this.patient.set(response);
        },
        error: (errors) => {
          if (errors.error.errors.statusCode === 404) {
            this.onBack();
          }
        },
      });
    }
  }

  onTrack(event: boolean) {
    this.isInvalidForm = event;
  }

  ngOnInit(): void {
    this.onLoadPatienDetail();
  }
}
