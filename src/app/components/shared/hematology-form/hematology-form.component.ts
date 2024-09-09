import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Hematology } from '../../../models/hematology.model';
import { Patient } from '../../../models/patient.model';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { PatientService } from '../../../services/patient.service';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { Subscription } from 'rxjs';
import { HematologyService } from '../../../services/hematology.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Gender } from '../../../helpers/constant.helper';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-hematology-form',
  standalone: true,
  imports: [
    InputTextModule,
    StepperModule,
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './hematology-form.component.html',
  styleUrl: './hematology-form.component.scss',
  providers: [PatientService, HematologyService],
})
export class HematologyFormComponent implements OnInit, OnDestroy {
  hematologyForm!: FormGroup;
  patient: Patient = new Patient();
  options: IDropdownOption[] = [];
  patientSubscription!: Subscription;
  patients: Patient[] = [];
  hematology: Hematology = new Hematology();
  config = null || new Hematology();
  response: CustomResponse<Hematology> = new CustomResponse(
    new Hematology(),
    []
  );

  currentDate = new Date();

  constructor(
    private builder: FormBuilder,
    private patientService: PatientService,
    private hematologyService: HematologyService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.onLoadHematologyForm();
  }

  ngOnDestroy(): void {
    this.patientSubscription && this.patientSubscription.unsubscribe();
  }

  onLoadHematology() {
    this.config = (this.dialogConfig.data as Hematology) || null;
    if (this.config) {
      this.hematology = this.config;
      this.patient = this.hematology.patient as Patient;
      this.hematologyForm.setValue({
        id: this.hematology.id,
        stepOne: {
          patient_id: this.hematology.patient_id,
          physician: this.hematology.physician,
          lab_no: this.hematology.lab_no,
          currentDate: this.hematology.createdAt,
        },
        stepTwo: {
          hemoglobin: this.hematology.hemoglobin,
          hematocrit: this.hematology.hematocrit,
          rbc_count: this.hematology.rbc_count,
          wbc_count: this.hematology.wbc_count,
          platelet_count: this.hematology.platelet_count,
        },
        stepThree: {
          neutrophil: this.hematology.neutrophil,
          segmented: this.hematology.segmented,
          stab: this.hematology.stab,
          lymphocyties: this.hematology.lymphocyties,
          monocyties: this.hematology.monocyties,
          eosinophils: this.hematology.eosinophils,
          basophils: this.hematology.basophils,
          remarks: this.hematology.remarks,
        },
      });
    }
  }

  onLoadHematologyForm() {
    this.hematologyForm = this.builder.group({
      id: [0],
      stepOne: this.builder.group({
        patient_id: [null, Validators.required],
        physician: [null, Validators.required],
        lab_no: [null, Validators.required],
        currentDate: [this.commonService.dateFormmater(this.currentDate)],
      }),
      stepTwo: this.builder.group({
        hemoglobin: [null, Validators.required],
        hematocrit: [null, Validators.required],
        rbc_count: [null, Validators.required],
        wbc_count: [null, Validators.required],
        platelet_count: [null, Validators.required],
      }),
      stepThree: this.builder.group({
        neutrophil: [null, Validators.required],
        segmented: [null, Validators.required],
        stab: [null, Validators.required],
        lymphocyties: [null, Validators.required],
        monocyties: [null, Validators.required],
        eosinophils: [null, Validators.required],
        basophils: [null, Validators.required],
        remarks: [null, Validators.required],
      }),
    });
    this.onLoadHematology();
    this.StepOne.controls['currentDate'].disable();
  }

  get StepOne() {
    return this.hematologyForm.get('stepOne') as FormGroup;
  }

  get StepTwo() {
    return this.hematologyForm.get('stepTwo') as FormGroup;
  }

  get StepThree() {
    return this.hematologyForm.get('stepThree') as FormGroup;
  }

  getMax(m: number, f: number) {
    if (!Object.entries(this.patient).length) {
      return 0;
    }
    return this.patient.sex === Gender.MALE ? m : f;
  }

  loadPatients() {
    this.patientSubscription = this.patientService.getAllPatients().subscribe({
      next: (response: CommonSuccessResponse<Patient>) => {
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
      },
    });
  }

  onSelectPatient(event: any) {
    const patient = this.patients.find((patient: Patient) => {
      return patient.id === event.value;
    });
    if (patient) this.patient = patient;
  }

  onCreateHematology(data: Hematology) {
    this.hematologyService.createHematology(data).subscribe({
      next: (response: CommonSuccessResponse<Hematology>) => {
        this.response = new CustomResponse<Hematology>(
          response.data as Hematology,
          [{ severity: 'info', summary: 'New user added successfully' }]
        );
      },
      error: (errors) => {
        this.response = new CustomResponse<Hematology>(errors, [
          { severity: 'error', summary: errors.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onUpdateHematology(data: Hematology) {
    this.hematologyService.updateHematology(data).subscribe({
      next: (response: CommonSuccessResponse<Hematology>) => {
        this.response = new CustomResponse<Hematology>(
          response.data as Hematology,
          [{ severity: 'info', summary: 'Detail updated successfully' }]
        );
      },
      error: (errors) => {
        this.response = new CustomResponse<Hematology>(errors, [
          { severity: 'error', summary: errors.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  submit() {
    const data = {
      id: this.hematologyForm.value.id,
      ...this.hematologyForm.value.stepOne,
      ...this.hematologyForm.value.stepTwo,
      ...this.hematologyForm.value.stepThree,
    } as Hematology;
    if (!this.config) {
      this.onCreateHematology(data);
    } else {
      this.onUpdateHematology(data);
    }
  }
}
