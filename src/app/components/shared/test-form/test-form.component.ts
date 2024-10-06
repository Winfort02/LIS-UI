import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { TEST_TYPE_DROPDOWN } from '../../../helpers/constant.helper';
import { ButtonModule } from 'primeng/button';
import { Test } from '../../../models/test.model';
import { TestService } from '../../../services/test.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, ButtonModule],
  templateUrl: './test-form.component.html',
  styleUrl: './test-form.component.scss',
  providers: [PatientService, TestService],
})
export class TestFormComponent implements OnInit {
  options: IDropdownOption[] = [];
  testTypeOptions: IDropdownOption[] = TEST_TYPE_DROPDOWN;
  patientSubscription!: Subscription;
  patients: Patient[] = [];
  patient = new Patient();
  testForm!: FormGroup;
  response = new CustomResponse(new Test(), []);

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private testService: TestService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.onLoadTestForm();
  }

  onLoadTestForm() {
    this.testForm = this.formBuilder.group({
      id: 0,
      patient_id: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
    if (this.dialogConfig.data) {
      const test = this.dialogConfig.data as Test;
      this.testForm.setValue({
        id: test.id,
        patient_id: test.patient_id,
        type: test.type,
      });
      this.testForm.updateValueAndValidity();
    }
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

  onCreateTest(data: Test) {
    this.testService.createTestRecord(data).subscribe({
      next: (response: CommonSuccessResponse<Test>) => {
        this.response = new CustomResponse<Test>(response.data as Test, [
          { severity: 'info', summary: 'Test Created successfully !' },
        ]);
      },
      error: (err) => {
        this.response = new CustomResponse<Test>(err, [
          { severity: 'error', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onUpdateTest(data: Test) {
    this.testService.updateTestRecord(data).subscribe({
      next: (response: CommonSuccessResponse<Test>) => {
        this.response = new CustomResponse<Test>(response.data as Test, [
          { severity: 'info', summary: 'Test Updated successfully !' },
        ]);
      },
      error: (err) => {
        this.response = new CustomResponse<Test>(err, [
          { severity: 'error', summary: err.error.message },
        ]);
        this.dialogRef.close(this.response);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onSaveTest() {
    if (this.testForm.valid) {
      const data = this.testForm.value as Test;
      if (!this.dialogConfig.data) {
        this.onCreateTest(data);
      } else {
        this.onUpdateTest(data);
      }
    }
  }
}
