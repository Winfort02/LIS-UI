import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureDetailHeaderComponent } from '../../shared/feature-detail-header/feature-detail-header.component';
import { ButtonColor } from '../../../enums/common.enum';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { TEST_TYPE_DROPDOWN } from '../../../helpers/constant.helper';
import { PatientService } from '../../../services/patient.service';
import { Subscription } from 'rxjs';
import { CommonSuccessResponse } from '../../../models/response.model';
import { Patient } from '../../../models/patient.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TestService } from '../../../services/test.service';
import { TestReport } from '../../../models/test-report.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-laboratory-report',
  standalone: true,
  imports: [
    FeatureDetailHeaderComponent,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './laboratory-report.component.html',
  styleUrl: './laboratory-report.component.scss',
  providers: [PatientService, TestService, DialogService],
})
export class LaboratoryReportComponent implements OnInit, OnDestroy {
  editBtnSeverity = ButtonColor.INFO;
  options: IDropdownOption[] = [];
  testTypeOptions: IDropdownOption[] = [
    { label: 'Select All', value: 'Select-all' },
    ...TEST_TYPE_DROPDOWN,
  ];
  patientSubscription!: Subscription;
  patients: Patient[] = [];
  patient = new Patient();
  maxDate = new Date();
  laboratoryReportForm!: FormGroup;
  dialogRef!: DynamicDialogRef;

  constructor(
    private patientService: PatientService,
    private testService: TestService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.onLoadFilterForm();
    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.patientSubscription && this.patientSubscription.unsubscribe();
  }

  onLoadFilterForm() {
    this.laboratoryReportForm = new FormGroup({
      patient_id: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
    });
  }

  loadPatients() {
    this.patientSubscription = this.patientService.getAllPatients().subscribe({
      next: (response: CommonSuccessResponse<Patient[]>) => {
        this.patients = response.data as Patient[];
      },
      error: (error) => {
        throw new Error(error);
      },
      complete: () => {
        this.options = this.patients.map((patient: Patient) => ({
          label: `${patient.first_name} ${patient.middle_name} ${patient.last_name}`,
          value: (patient.id as number) || 0,
        }));
        this.options = [{ value: 0, label: 'Select All' }, ...this.options];
      },
    });
  }

  onSelectPatient(event: any) {
    const patient = this.patients.find((patient: Patient) => {
      return patient.id === event.value;
    });
    if (patient) this.patient = patient;
  }

  print() {
    if (this.laboratoryReportForm.valid) {
      const data = this.laboratoryReportForm.value as TestReport;
      this.testService.generateTestReport(data).subscribe({
        next: (response) => {
          this.dialogRef = this.dialogService.open(PdfViewerComponent, {
            header: 'LABORATORY REPORT PDF',
            width: '80%',
            style: { minWidth: '455px', maxWidth: '970px' },
            position: 'top',
            focusOnShow: false,
            data: response,
          });

          this.dialogRef.onClose.subscribe(() => {
            return;
          });
        },
        error: (err) => {
          throw new Error(err);
        },
      });
    }
  }
}
