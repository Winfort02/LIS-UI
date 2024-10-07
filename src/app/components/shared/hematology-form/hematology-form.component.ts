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
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { HematologyService } from '../../../services/hematology.service';
import { Gender } from '../../../helpers/constant.helper';
import { TestService } from '../../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../../../models/test.model';
import { FeatureDetailHeaderComponent } from '../feature-detail-header/feature-detail-header.component';
import { Subscription } from 'rxjs';
import { ApplicationUrl } from '../../../enums/common.enum';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

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
    FeatureDetailHeaderComponent,
    MessagesModule,
  ],
  templateUrl: './hematology-form.component.html',
  styleUrl: './hematology-form.component.scss',
  providers: [HematologyService, TestService, DialogService],
})
export class HematologyFormComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  isComponentShow: boolean = false;
  hematologyForm!: FormGroup;
  patient: Patient = new Patient();
  options: IDropdownOption[] = [];
  patients = new Patient();
  hematology: Hematology = new Hematology();
  response: CustomResponse<Hematology> = new CustomResponse(
    new Hematology(),
    []
  );
  testSubscription!: Subscription;
  test = new Test();

  currentDate = new Date();
  dialogRef!: DynamicDialogRef;

  constructor(
    private builder: FormBuilder,
    private hematologyService: HematologyService,
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.onLoadTestTransaction();
  }

  ngOnDestroy(): void {
    this.testSubscription && this.testSubscription.unsubscribe();
  }

  print() {
    this.hematologyService
      .generateHemotology(this.hematology.id as number)
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
      this.testSubscription = this.testService
        .getTestRecordByTransactionNo(transactionNo)
        .subscribe({
          next: (response: CommonSuccessResponse<Test>) => {
            if (response.success) this.test = response.data as Test;
            this.patient = this.test.patient as Patient;
            this.hematology = this.test.hematology as Hematology;
          },
          error: (err) => {
            this.router.navigate(['application/test']);
            throw new Error(err);
          },
          complete: () => {
            this.onLoadHematologyForm();
            this.isComponentShow = true;
            if (this.hematology) {
              this.onLoadHematology();
              this.hematologyForm.disable();
            }
          },
        });
    }
  }

  onLoadHematology() {
    this.hematologyForm.setValue({
      id: this.hematology.id,
      stepOne: {
        physician: this.hematology.physician,
        lab_no: this.hematology.lab_no,
      },
      stepTwo: {
        hemoglobin: this.hematology.hemoglobin,
        hematocrit: this.hematology.hematocrit,
        rbc_count: this.hematology.rbc_count,
        wbc_count: this.hematology.wbc_count,
        platelet_count: this.hematology.platelet_count,
      },
      stepThree: {
        mcv: this.hematology.mcv,
        mch: this.hematology.mch,
        mchc: this.hematology.mchc,
        rdw_cv: this.hematology.rdw_cv,
        mpv: this.hematology.mpv,
        pdw: this.hematology.pdw,
      },
      stepFour: {
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
    this.hematologyForm.updateValueAndValidity();
  }

  onLoadHematologyForm() {
    this.hematologyForm = this.builder.group({
      id: [null],
      stepOne: this.builder.group({
        physician: [null, Validators.required],
        lab_no: [null, Validators.required],
      }),
      stepTwo: this.builder.group({
        hemoglobin: [null, Validators.required],
        hematocrit: [null, Validators.required],
        rbc_count: [null, Validators.required],
        wbc_count: [null, Validators.required],
        platelet_count: [null, Validators.required],
      }),
      stepThree: this.builder.group({
        mcv: [null, Validators.required],
        mch: [null, Validators.required],
        mchc: [null, Validators.required],
        rdw_cv: [null, Validators.required],
        mpv: [null, Validators.required],
        pdw: [null, Validators.required],
      }),
      stepFour: this.builder.group({
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

  get StepFour() {
    return this.hematologyForm.get('stepFour') as FormGroup;
  }

  getMax(m: number, f: number) {
    if (!Object.entries(this.patient).length) {
      return 0;
    }
    return this.patient.sex === Gender.MALE ? m : f;
  }

  onCreateHematology(data: Hematology) {
    this.hematologyService.createHematology(data).subscribe({
      next: (response: CommonSuccessResponse<Hematology>) => {
        this.messages = [
          { severity: 'info', summary: 'Hematology created successfully' },
        ];
        this.hematology = response.data as Hematology;
      },
      error: (errors) => {
        this.messages = [{ severity: 'error', summary: errors.error.message }];
      },
      complete: () => {
        this.hematologyForm.disable();
      },
    });
  }

  onUpdateHematology(data: Hematology) {
    this.hematologyService.updateHematology(data).subscribe({
      next: (response: CommonSuccessResponse<Hematology>) => {
        this.messages = [
          { severity: 'info', summary: 'Hematology test updated successfully' },
        ];
        this.hematology = response.data as Hematology;
      },
      error: (errors) => {
        this.messages = [{ severity: 'error', summary: errors.error.message }];
      },
      complete: () => {
        this.hematologyForm.disable();
      },
    });
  }

  submit() {
    const data = {
      id: this.hematologyForm.value.id,
      test_id: this.test.id,
      ...this.hematologyForm.value.stepOne,
      ...this.hematologyForm.value.stepTwo,
      ...this.hematologyForm.value.stepThree,
      ...this.hematologyForm.value.stepFour,
    } as Hematology;

    if (!this.hematology) {
      this.onCreateHematology(data);
    } else {
      this.onUpdateHematology(data);
    }
  }
}
