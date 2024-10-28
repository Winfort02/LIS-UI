import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { FeatureDetailHeaderComponent } from '../feature-detail-header/feature-detail-header.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Chemistry } from '../../../models/chemistry.model';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { Subscription } from 'rxjs';
import { Test } from '../../../models/test.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { FeatureFormHeaderComponent } from '../feature-form-header/feature-form-header.component';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ChemistryService } from '../../../services/chemistry.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-chemistry-form',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureDetailHeaderComponent,
    FeatureFormHeaderComponent,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
  ],
  templateUrl: './chemistry-form.component.html',
  styleUrl: './chemistry-form.component.scss',
  providers: [TestService, DialogService, ChemistryService],
})
export class ChemistryFormComponent implements OnInit, OnDestroy {
  isComponentShow = false;
  messages: Message[] = [];
  chemistryForm!: FormGroup;
  chemistry = new Chemistry();
  response: CustomResponse<Chemistry> = new CustomResponse(new Chemistry(), []);
  chemistrySubscription!: Subscription;
  test = new Test();
  maxDate = new Date();

  dialogRef!: DynamicDialogRef;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router,
    private chemistryService: ChemistryService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.onLoadTestTransaction();
  }

  ngOnDestroy(): void {
    this.chemistrySubscription && this.chemistrySubscription.unsubscribe();
  }

  print() {
    this.chemistryService
      .generateChemistryPDF(this.chemistry.id as number)
      .subscribe({
        next: (response) => {
          this.dialogRef = this.dialogService.open(PdfViewerComponent, {
            header: 'HEMATOLOGY PDF',
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
        error: (error) => {
          throw new Error(error);
        },
      });
  }

  onLoadTestTransaction() {
    const transactionNo = this.route.snapshot.params['transaction_no'];
    if (transactionNo) {
      this.chemistrySubscription = this.testService
        .getTestRecordByTransactionNo(transactionNo)
        .subscribe({
          next: (response: CommonSuccessResponse<Test>) => {
            if (response.success) this.test = response.data as Test;
            this.chemistry = this.test.chemistry as Chemistry;
          },
          error: (err) => {
            this.router.navigate(['application/test']);
            throw new Error(err);
          },
          complete: () => {
            this.onInitializeChemistryForm();
            this.isComponentShow = true;
            if (this.chemistry) {
              this.onUpdateChemistryForm();
              this.chemistryForm.disable();
            }
          },
        });
    }
  }

  onInitializeChemistryForm() {
    this.chemistryForm = this.formBuilder.group({
      id: [null],
      basicForm: this.formBuilder.group({
        physician: [null, Validators.required],
        lab_no: [null, Validators.required],
        last_meal_take: [null, Validators.required],
        time_taken: [null, Validators.required],
        test_requested: [null, Validators.required],
      }),
      bloodSugarForm: this.formBuilder.group({
        fasting_blood_sugar: [null],
        random_blood_sugar: [null],
        post_prandial: [null],
      }),
      lipidForm: this.formBuilder.group({
        total_cholesterol: [null],
        triglycerides: [null],
        hdl: [null],
        ldl: [null],
      }),
      kidneyFunctionForm: this.formBuilder.group({
        uric_acid: [null],
        creatinine: [null],
        bun: [null],
      }),
      enzymeForm: this.formBuilder.group({
        sgpt: [null],
        sgot: [null],
      }),
      electrolyteForm: this.formBuilder.group({
        sodium: [null],
        potasium: [null],
        ionized_calcium: [null],
        calcium: [null],
        magnesium: [null],
        remarks: [null, Validators.required],
      }),
    });
  }

  onUpdateChemistryForm() {
    this.chemistryForm.setValue({
      id: this.chemistry.id,
      basicForm: {
        physician: this.chemistry.physician,
        lab_no: this.chemistry.lab_no,
        last_meal_take: new Date(this.chemistry.last_meal_take),
        time_taken: new Date(this.chemistry.time_taken),
        test_requested: this.chemistry.test_requested,
      },
      bloodSugarForm: {
        fasting_blood_sugar: this.chemistry.fasting_blood_sugar,
        random_blood_sugar: this.chemistry.random_blood_sugar,
        post_prandial: this.chemistry.post_prandial,
      },
      lipidForm: {
        total_cholesterol: this.chemistry.total_cholesterol,
        triglycerides: this.chemistry.triglycerides,
        hdl: this.chemistry.hdl,
        ldl: this.chemistry.ldl,
      },
      kidneyFunctionForm: {
        uric_acid: this.chemistry.uric_acid,
        creatinine: this.chemistry.creatinine,
        bun: this.chemistry.bun,
      },
      enzymeForm: {
        sgpt: this.chemistry.sgpt,
        sgot: this.chemistry.sgot,
      },
      electrolyteForm: {
        sodium: this.chemistry.sodium,
        potasium: this.chemistry.potasium,
        ionized_calcium: this.chemistry.ionized_calcium,
        calcium: this.chemistry.calcium,
        magnesium: this.chemistry.magnesium,
        remarks: this.chemistry.remarks,
      },
    });
    // this.chemistryForm.updateValueAndValidity();
  }

  convertValue(input: number | null, value: number): number | null {
    if (!input) return null;
    const result = (input * value).toFixed(2);
    return parseFloat(result);
  }

  convertByDivision(input: number | null, value: number): number | null {
    if (!input) return null;
    const result = (input / value).toFixed(2);
    return parseFloat(result);
  }

  get BasicForm() {
    return this.chemistryForm.get('basicForm') as FormGroup;
  }

  get BloodSugarForm() {
    return this.chemistryForm.get('bloodSugarForm') as FormGroup;
  }

  get LipidForm() {
    return this.chemistryForm.get('lipidForm') as FormGroup;
  }

  get KidneyFunctionForm() {
    return this.chemistryForm.get('kidneyFunctionForm') as FormGroup;
  }

  get EnzymeForm() {
    return this.chemistryForm.get('enzymeForm') as FormGroup;
  }

  get ElectrolyteForm() {
    return this.chemistryForm.get('electrolyteForm') as FormGroup;
  }

  get fastingBloodSugarConvertion(): number | null {
    const value = this.BloodSugarForm.value?.fasting_blood_sugar || 0;
    return this.convertValue(value, 0.05551);
  }

  get randomBloodSugarConvertion(): number | null {
    const value = this.BloodSugarForm.value?.random_blood_sugar || 0;
    return this.convertValue(value, 0.05551);
  }

  get postPrandialConvertion(): number | null {
    const value = this.BloodSugarForm.value?.post_prandial || 0;
    return this.convertValue(value, 0.05551);
  }

  get totalCholesterolConverstion(): number | null {
    const value = this.LipidForm.value?.total_cholesterol || 0;
    return this.convertValue(value, 0.02586);
  }

  get triglyceridesConverstion(): number | null {
    const value = this.LipidForm.value?.triglycerides || 0;
    return this.convertValue(value, 0.01126);
  }

  get hdlConverstion(): number | null {
    const value = this.LipidForm.value?.hdl || 0;
    return this.convertByDivision(value, 0.026);
  }

  get ldlConverstion(): number | null {
    const value = this.LipidForm.value?.ldl || 0;
    return this.convertByDivision(value, 0.026);
  }

  get uricAcidConversion(): number | null {
    const value = this.KidneyFunctionForm.value?.uric_acid || 0;
    return this.convertValue(value, 59.48);
  }

  get creatinineConversion(): number | null {
    const value = this.KidneyFunctionForm.value?.creatinine || 0;
    return this.convertValue(value, 88.4);
  }

  get bunConversion(): number | null {
    const value = this.KidneyFunctionForm.value?.bun || 0;
    return this.convertValue(value, 0.357);
  }

  get ionizeCalciumConversion(): number | null {
    const value = this.ElectrolyteForm.value?.ionized_calcium || 0;
    return this.convertValue(value, 0.25);
  }

  get calciumConversion(): number | null {
    const value = this.ElectrolyteForm.value?.calcium || 0;
    return this.convertValue(value, 0.25);
  }

  get magnesiumConversion(): number | null {
    const value = this.ElectrolyteForm.value?.magnesium || 0;
    return this.convertValue(value, 2.43);
  }

  prepareChemistryFormData(): Chemistry {
    return {
      id: this.chemistryForm.value.id,
      test_id: this.test.id,
      ...this.BasicForm.value,
      ...this.BloodSugarForm.value,
      ...this.LipidForm.value,
      ...this.KidneyFunctionForm.value,
      ...this.EnzymeForm.value,
      ...this.ElectrolyteForm.value,
    } as Chemistry;
  }

  onCreateChemistry(data: Chemistry) {
    this.chemistryService.createChemistry(data).subscribe({
      next: (response: CommonSuccessResponse<Chemistry>) => {
        this.messages = [
          { severity: 'info', summary: 'Chemistry created successfully' },
        ];
        this.chemistry = response.data as Chemistry;
      },
      error: (errors) => {
        this.messages = [{ severity: 'error', summary: errors.error.message }];
      },
      complete: () => {
        this.chemistryForm.disable();
      },
    });
  }

  onUpdateChemistry(data: Chemistry) {
    this.chemistryService.updateChemistry(data).subscribe({
      next: (response: CommonSuccessResponse<Chemistry>) => {
        this.messages = [
          { severity: 'info', summary: 'Chemistry test updated successfully' },
        ];
        this.chemistry = response.data as Chemistry;
      },
      error: (errors) => {
        this.messages = [{ severity: 'error', summary: errors.error.message }];
      },
      complete: () => {
        this.chemistryForm.disable();
      },
    });
  }

  onFormSubmit() {
    const data: Chemistry = this.prepareChemistryFormData();
    if (!this.chemistry) {
      this.onCreateChemistry(data);
    } else {
      this.onUpdateChemistry(data);
    }
  }
}
