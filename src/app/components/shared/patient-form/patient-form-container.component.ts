import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {
  FIELD_VALIDATIONS,
  Gender,
  STATUS_OPTON,
} from '../../../helpers/constant.helper';

import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { Patient } from '../../../models/patient.model';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-patient-form-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
  ],
  templateUrl: './patient-form-container.component.html',
  styleUrl: './patient-form-container.component.scss',
})
export class PatientFormContainerComponent implements OnInit {
  @Input() formId = '';
  @Output() onFormSubmit = new EventEmitter<Patient>();
  @Output() onTrackChanges = new EventEmitter();
  @Input() patient = signal<Patient>(new Patient());
  @Input() isLock = signal<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.onEffect();
  }

  patientForm!: FormGroup;
  statusOptions = STATUS_OPTON;
  maxDate = new Date();

  gender = Gender;

  onEffect() {
    effect(
      () => {
        const isEmpty = Object.entries(this.patient()).length;
        if (isEmpty) {
          this.onUpdatePatientForm();
        }
        this.onToggleForm();
      },
      { allowSignalWrites: true }
    );
  }

  onUpdatePatientForm() {
    this.patientForm.setValue({
      id: this.patient().id as number,
      first_name: this.patient().first_name,
      last_name: this.patient().last_name,
      middle_name: this.patient().middle_name || '-',
      contact_number: this.patient().contact_number,
      date_of_birth: this.patient().date_of_birth,
      civil_status: this.patient().civil_status,
      sex: this.patient().sex,
      address: this.patient().address,
    });
  }

  onToggleForm() {
    if (this.isLock()) {
      this.patientForm.disable();
    } else {
      this.patientForm.enable();
    }
  }

  onLoadPatientForm() {
    this.patientForm = this.formBuilder.group({
      id: [0],
      first_name: [
        null,
        [Validators.required, Validators.pattern(FIELD_VALIDATIONS.NAME)],
      ],
      last_name: [
        null,
        [Validators.required, Validators.pattern(FIELD_VALIDATIONS.NAME)],
      ],
      middle_name: [''],
      contact_number: [
        null,
        [Validators.required, Validators.pattern(FIELD_VALIDATIONS.PHONE)],
      ],
      date_of_birth: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      address: [null, [Validators.required]],
      civil_status: [null, [Validators.required]],
    });
  }

  onSubmit() {
    let dob = this.patientForm.value.date_of_birth;
    if (Object.entries(this.patient()).length) {
    }
    const patient: Patient = {
      ...this.patientForm.value,
      date_of_birth: this.commonService.formatDateRequest(dob),
    };
    this.onFormSubmit.emit(patient);
  }

  ngOnInit(): void {
    this.onLoadPatientForm();
    this.patientForm.valueChanges.subscribe(() => {
      this.onTrackChanges.emit(this.patientForm.valid);
    });
  }
}
