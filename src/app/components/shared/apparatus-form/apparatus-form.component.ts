import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { APPARATUS_UNIT_DROPDOWN } from '../../../helpers/constant.helper';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApparatusService } from '../../../services/apparatus.service';
import { Apparatus } from '../../../models/apparatus.model';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-apparatus-form',
  standalone: true,
  imports: [
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    ButtonModule,
    RadioButtonModule,
  ],
  templateUrl: './apparatus-form.component.html',
  styleUrl: './apparatus-form.component.scss',
  providers: [ApparatusService],
})
export class ApparatusFormComponent implements OnInit {
  unitOptions: IDropdownOption[] = APPARATUS_UNIT_DROPDOWN;
  apparatusForm!: FormGroup;
  response = new CustomResponse(new Apparatus(), []);

  constructor(
    private apparatusService: ApparatusService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.onInitializeApparatusForm();
  }

  onInitializeApparatusForm() {
    this.apparatusForm = new FormGroup({
      id: new FormControl(null),
      apparatus_name: new FormControl(null, [Validators.required]),
      unit: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });

    if (this.dialogConfig.data) {
      const apparatus = this.dialogConfig.data as Apparatus;
      this.apparatusForm.setValue({
        id: apparatus.id,
        apparatus_name: apparatus.apparatus_name,
        unit: apparatus.unit,
        status: apparatus.status,
      });
      this.apparatusForm.updateValueAndValidity();
    }
  }

  onCreateApparatus(data: Apparatus) {
    this.apparatusService.createAppratus(data).subscribe({
      next: (response: CommonSuccessResponse<Apparatus>) => {
        this.response = new CustomResponse<Apparatus>(
          response.data as Apparatus,
          [{ severity: 'info', summary: 'Apparatus Created successfully !' }]
        );
      },
      error: (err) => {
        this.response = new CustomResponse<Apparatus>(err, [
          { severity: 'error', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onUpdateApparatus(data: Apparatus) {
    this.apparatusService.updateAppratus(data).subscribe({
      next: (response: CommonSuccessResponse<Apparatus>) => {
        this.response = new CustomResponse<Apparatus>(
          response.data as Apparatus,
          [{ severity: 'info', summary: 'Apparatus Updated successfully !' }]
        );
      },
      error: (err) => {
        this.response = new CustomResponse<Apparatus>(err, [
          { severity: 'error', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onSave() {
    if (this.apparatusForm.valid) {
      if (this.dialogConfig.data) {
        this.onUpdateApparatus(this.apparatusForm.value as Apparatus);
      } else {
        this.onCreateApparatus(this.apparatusForm.value as Apparatus);
      }
    }
  }
}
