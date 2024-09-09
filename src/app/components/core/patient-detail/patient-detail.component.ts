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
  ButtonColor,
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
  editIconBtn = Icon.EDIT;
  editBtnLabel = ButtonLabel.EDIT;
  isEdit = signal<boolean>(false);
  editBtnSeverity = ButtonColor.INFO;
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
      this.patientService.getPatientById(this.paramsId).subscribe({
        next: (response: CommonSuccessResponse<Patient>) => {
          this.patient.set(response.data as Patient);
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
