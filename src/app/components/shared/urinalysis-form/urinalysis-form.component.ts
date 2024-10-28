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
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { CommonSuccessResponse } from '../../../models/response.model';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { Urinalysis } from '../../../models/urinalysis.model';
import { UrinalysisService } from '../../../services/urinalysis.service';
import {
  CHEMICAL_TEST_DROPDOWN_COMMON,
  CHEMICAL_TEST_DROPDOWN_MAX_3PLUS,
  CHEMICAL_TEST_DROPDOWN_NITRE,
  CHEMICAL_TEST_DROPDOWN_PH,
  CHEMICAL_TEST_DROPDOWN_SPEC_GRAV,
  CHEMICAL_TEST_DROPDOWN_WITH_TRACE,
  COMMON_CHEMICAL_TEST,
  COMMON_CHEMICAL_TEST_OPTION,
} from '../../../helpers/constant.helper';
import { TestService } from '../../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../../../models/test.model';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FeatureDetailHeaderComponent } from '../feature-detail-header/feature-detail-header.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { ApplicationUrl } from '../../../enums/common.enum';
import { CommonService } from '../../../services/common.service';
import { FeatureFormHeaderComponent } from '../feature-form-header/feature-form-header.component';

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
    MessagesModule,
    FeatureDetailHeaderComponent,
    FeatureFormHeaderComponent,
  ],
  templateUrl: './urinalysis-form.component.html',
  styleUrl: './urinalysis-form.component.scss',
  providers: [UrinalysisService, TestService, DialogService],
})
export class UrinalysisFormComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  isComponentShow: boolean = false;
  urinalysisForm!: FormGroup;
  options: IDropdownOption[] = [];
  urinalysis = new Urinalysis();
  testSubscription!: Subscription;
  test = new Test();

  commonOptions: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_COMMON;
  nitriteOptions: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_NITRE;
  phOptions: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_PH;
  specGravOptions: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_SPEC_GRAV;
  commonWithTraceOptions: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_WITH_TRACE;
  commonMaxThree: IDropdownOption[] = CHEMICAL_TEST_DROPDOWN_MAX_3PLUS;
  commonStatus: IDropdownOption[] = COMMON_CHEMICAL_TEST_OPTION;
  commonChemicalTestOption: IDropdownOption[] = COMMON_CHEMICAL_TEST;
  dialogRef!: DynamicDialogRef;

  constructor(
    private formBuilder: FormBuilder,
    private urinalysisService: UrinalysisService,
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  print() {
    this.urinalysisService
      .generateUrinalysis(this.urinalysis.id as number)
      .subscribe({
        next: (response) => {
          this.dialogRef = this.dialogService.open(PdfViewerComponent, {
            header: 'URINALYSIS PDF',
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

  onLoadTransactionNumber() {
    const transactionNo = this.route.snapshot.params['transaction_no'];
    if (transactionNo) {
      this.testSubscription = this.testService
        .getTestRecordByTransactionNo(transactionNo)
        .subscribe({
          next: (response: CommonSuccessResponse<Test>) => {
            if (response.success) this.test = response.data as Test;
            this.urinalysis = this.test.urinalysis as Urinalysis;
          },
          error: (err) => {
            this.router.navigate([
              `${ApplicationUrl.APPLICATION}/${ApplicationUrl.TEST}`,
            ]);
            throw new Error(err);
          },
          complete: () => {
            this.onLoadForm();
            this.isComponentShow = true;
            if (this.urinalysis) {
              this.onLoadUrinalysis();
              this.urinalysisForm.disable();
            }
          },
        });
    }
  }

  onLoadForm() {
    this.urinalysisForm = this.formBuilder.group({
      id: [null],
      stepOne: this.formBuilder.group({
        physician: [null, Validators.required],
        lab_no: [null, Validators.required],
      }),
      stepTwo: this.formBuilder.group({
        color: [null, Validators.required],
        transparancy: [null, Validators.required],
        ph: [null, Validators.required],
        spec_gravity: [null, Validators.required],
        leukocyte_esterase: [null, Validators.required],
        nitrite: [null, Validators.required],
        urobilinogen: [null, Validators.required],
        blood: [null, Validators.required],
        ketones: [null, Validators.required],
        bilirubin: [null, Validators.required],
        glucose: [null, Validators.required],
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
        cast_rbc: [''],
        cast_wbc: [''],
        cast_waxy: [null],
        cast_broad: [null],
        remarks: [null, Validators.required],
      }),
    });
    // this.onLoadUrinalysis();
  }

  onLoadUrinalysis() {
    this.urinalysisForm.setValue({
      id: this.urinalysis.id,
      stepOne: {
        physician: this.urinalysis.physician,
        lab_no: this.urinalysis.lab_no,
      },
      stepTwo: {
        color: this.urinalysis.color,
        transparancy: this.urinalysis.transparancy,
        ph: this.urinalysis.ph,
        spec_gravity: this.urinalysis.spec_gravity,
        protein: this.urinalysis.protein,
        leukocyte_esterase: this.urinalysis.leukocyte_esterase,
        nitrite: this.urinalysis.nitrite,
        urobilinogen: this.urinalysis.urobilinogen,
        blood: this.urinalysis.blood,
        ketones: this.urinalysis.ketones,
        bilirubin: this.urinalysis.bilirubin,
        glucose: this.urinalysis.glucose,
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

  submit() {
    if (this.urinalysisForm.valid) {
      const data = {
        id: this.urinalysisForm.value.id,
        test_id: this.test.id,
        ...this.urinalysisForm.value.stepOne,
        ...this.urinalysisForm.value.stepTwo,
        ...this.urinalysisForm.value.stepThree,
        ...this.urinalysisForm.value.stepFour,
        ...this.urinalysisForm.value.stepFive,
      } as Urinalysis;

      if (!this.urinalysis) {
        this.onCreateUrinalysis(data);
      } else {
        this.onUpdateUrinalysis(data);
      }
    }
  }

  onCreateUrinalysis(data: Urinalysis) {
    this.urinalysisService.createUrinalysis(data).subscribe({
      next: (response: CommonSuccessResponse<Urinalysis>) => {
        this.urinalysis = response.data as Urinalysis;
        this.messages = [
          { severity: 'info', summary: 'New Urinalysis added successfully.' },
        ];
      },
      error: (err) => {
        this.messages = [{ severity: 'error', summary: err.error.message }];
      },
      complete: () => {
        this.urinalysisForm.disable();
      },
    });
  }

  onUpdateUrinalysis(data: Urinalysis) {
    this.urinalysisService.updateUrinalysis(data).subscribe({
      next: (response: CommonSuccessResponse<Urinalysis>) => {
        this.urinalysis = response.data as Urinalysis;
        this.messages = [
          {
            severity: 'info',
            summary: 'Urinalysis detail updated successfully.',
          },
        ];
      },
      error: (err) => {
        this.messages = [{ severity: 'error', summary: err.error.message }];
      },
      complete: () => {
        this.urinalysisForm.disable();
      },
    });
  }

  ngOnInit(): void {
    this.onLoadTransactionNumber();
  }

  ngOnDestroy(): void {
    this.testSubscription && this.testSubscription.unsubscribe();
  }
}
