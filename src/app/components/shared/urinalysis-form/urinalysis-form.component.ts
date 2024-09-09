import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { PatientService } from '../../../services/patient.service';
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { Urinalysis } from '../../../models/urinalysis.model';
import { UrinalysisService } from '../../../services/urinalysis.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-urinalysis-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StepperModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './urinalysis-form.component.html',
  styleUrl: './urinalysis-form.component.scss',
  providers: [PatientService, UrinalysisService],
})
export class UrinalysisFormComponent implements OnInit, OnDestroy {
  urinalysisForm!: FormGroup;
  patient: Patient = new Patient();
  patients: Patient[] = [];
  options: IDropdownOption[] = [];
  patientSubscription!: Subscription;
  urinalysis = new Urinalysis();

  currentDate = new Date();
  response: CustomResponse<Urinalysis> = new CustomResponse(
    new Urinalysis(),
    []
  );
  config = null || new Urinalysis();

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private urinalysisService: UrinalysisService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private commonService: CommonService
  ) {}

  onLoadForm() {
    this.config = (this.dialogConfig.data as Urinalysis) || null;
    this.urinalysisForm = this.formBuilder.group({
      id: [null],
      stepOne: this.formBuilder.group({
        patient_id: [null, Validators.required],
        physician: [null, Validators.required],
        lab_no: [null, Validators.required],
        currentDate: [this.commonService.dateFormmater(this.currentDate)],
      }),
      stepTwo: this.formBuilder.group({
        color: [null, Validators.required],
        transparancy: [null, Validators.required],
        ph: [null, Validators.required],
        spec_gravity: [null, Validators.required],
        reduce_sugar: [null, Validators.required],
        protein: [null, Validators.required],
      }),
      stepThree: this.formBuilder.group({
        wbc_count: [null, Validators.required],
        rbc_count: [null, Validators.required],
        squamous: [null],
        rental_tubular: [null],
        transitional: [null],
        bacteria: [null],
        yeast: [null],
        mucus_thread: [null],
      }),
      stepFour: this.formBuilder.group({
        amorphous_urates: [null],
        amorphous_phosphates: [null],
        uric_acid: [null],
        calcium_oxalate: [null],
        triple_phosphate: [null],
        calcium_carbonate: [null],
        calcium_phosphate: [null],
        ammonium_biurate: [null],
      }),
      stepFive: this.formBuilder.group({
        hyaline: [null],
        fine_granular: [null],
        coarse_granular: [null],
        cast_rbc: [0.0],
        cast_wbc: [0.0],
        cast_waxy: [null],
        cast_broad: [null],
        remarks: [null, Validators.required],
      }),
    });
    this.onLoadUrinalysis();
    this.StepOne.controls['currentDate'].disable();
  }

  onLoadUrinalysis() {
    if (this.config) {
      this.urinalysis = this.config as Urinalysis;
      this.patient = this.config.patient as Patient;
      this.urinalysisForm.setValue({
        id: this.urinalysis.id,
        stepOne: {
          patient_id: this.patient.id,
          physician: this.urinalysis.physician,
          lab_no: this.urinalysis.lab_no,
          currentDate: this.urinalysis.createdAt,
        },
        stepTwo: {
          color: this.urinalysis.color,
          transparancy: this.urinalysis.transparancy,
          ph: this.urinalysis.ph,
          spec_gravity: this.urinalysis.spec_gravity,
          reduce_sugar: this.urinalysis.reduce_sugar,
          protein: this.urinalysis.protein,
        },
        stepThree: {
          wbc_count: this.urinalysis.wbc_count,
          rbc_count: this.urinalysis.rbc_count,
          squamous: this.urinalysis.squamous,
          rental_tubular: this.urinalysis.rental_tubular,
          transitional: this.urinalysis.transitional,
          bacteria: this.urinalysis.bacteria,
          yeast: this.urinalysis.yeast,
          mucus_thread: this.urinalysis.mucus_thread,
        },
        stepFour: {
          amorphous_urates: this.urinalysis.amorphous_urates,
          amorphous_phosphates: this.urinalysis.amorphous_phosphates,
          uric_acid: this.urinalysis.uric_acid,
          calcium_oxalate: this.urinalysis.calcium_oxalate,
          triple_phosphate: this.urinalysis.triple_phosphate,
          calcium_carbonate: this.urinalysis.calcium_carbonate,
          calcium_phosphate: this.urinalysis.calcium_phosphate,
          ammonium_biurate: this.urinalysis.ammonium_biurate,
        },
        stepFive: {
          hyaline: this.urinalysis.hyaline,
          fine_granular: this.urinalysis.fine_granular,
          coarse_granular: this.urinalysis.coarse_granular,
          cast_rbc: this.urinalysis.cast_rbc,
          cast_wbc: this.urinalysis.cast_wbc,
          cast_waxy: this.urinalysis.cast_waxy,
          cast_broad: this.urinalysis.cast_broad,
          remarks: this.urinalysis.remarks,
        },
      });
    }
  }

  get StepOne() {
    return this.urinalysisForm.get('stepOne') as FormGroup;
  }

  get StepTwo() {
    return this.urinalysisForm.get('stepTwo') as FormGroup;
  }

  get StepThree() {
    return this.urinalysisForm.get('stepThree') as FormGroup;
  }

  get StepFour() {
    return this.urinalysisForm.get('stepFour') as FormGroup;
  }

  get StepFive() {
    return this.urinalysisForm.get('stepFive') as FormGroup;
  }

  onLoadPatient() {
    this.patientSubscription = this.patientService.getAllPatients().subscribe({
      next: (response: CommonSuccessResponse<Patient>) => {
        this.patients = response.data as Patient[];
      },
      error: (err) => {
        throw new Error(err);
      },
      complete: () => {
        this.options = this.patients.map((patient: Patient) => ({
          label: `${patient.first_name} ${patient.middle_name} ${patient.last_name}`,
          value: (patient.id as number) || 0,
        }));
      },
    });
  }

  onSelectPatient(event: any) {
    const patient = this.patients.find((patient: Patient) => {
      return patient.id === event.value;
    });
    if (patient) this.patient = patient;
  }

  submit() {
    if (this.urinalysisForm.valid) {
      const data = {
        id: this.urinalysisForm.value.id,
        ...this.urinalysisForm.value.stepOne,
        ...this.urinalysisForm.value.stepTwo,
        ...this.urinalysisForm.value.stepThree,
        ...this.urinalysisForm.value.stepFour,
        ...this.urinalysisForm.value.stepFive,
      } as Urinalysis;

      if (!this.config) {
        this.onCreateUrinalysis(data);
      }
    }
  }

  onCreateUrinalysis(data: Urinalysis) {
    this.urinalysisService.createUrinalysis(data).subscribe({
      next: (response: CommonSuccessResponse<Urinalysis>) => {
        this.response = new CustomResponse<Urinalysis>(
          response.data as Urinalysis,
          [{ severity: 'info', summary: 'New Urinalysis added successfully.' }]
        );
      },
      error: (err) => {
        this.response = new CustomResponse<Urinalysis>(err, [
          { severity: 'error', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  ngOnInit(): void {
    this.onLoadPatient();
    this.onLoadForm();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription) this.patientSubscription.unsubscribe();
  }
}
