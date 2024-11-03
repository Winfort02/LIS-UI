import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Apparatus } from '../../../models/apparatus.model';
import { ApparatusService } from '../../../services/apparatus.service';
import { Subscription } from 'rxjs';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { ADJUSTMENT_DROPDOWN } from '../../../helpers/constant.helper';
import { AdjustmentService } from '../../../services/adjustment.service';
import { Adjustment } from '../../../models/adjustment.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdjustmentType } from '../../../enums/common.enum';

@Component({
  selector: 'app-adjustment-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './adjustment-form.component.html',
  styleUrl: './adjustment-form.component.scss',
  providers: [ApparatusService, AdjustmentService],
})
export class AdjustmentFormComponent implements OnInit, OnDestroy {
  adjustmentForm!: FormGroup;
  options: Apparatus[] = [];
  typeOptions = ADJUSTMENT_DROPDOWN;
  apparatusSub!: Subscription;
  response = new CustomResponse(new Adjustment(), []);

  constructor(
    private apparatusService: ApparatusService,
    private adjustmentService: AdjustmentService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadAdjustmentForm();
    this.onLoadApparatus();
  }

  ngOnDestroy(): void {
    this.apparatusSub && this.apparatusSub.unsubscribe();
  }

  onLoadApparatus() {
    this.apparatusSub = this.apparatusService.getActiveApparatus().subscribe({
      next: (response: CommonSuccessResponse<Apparatus[]>) => {
        this.options = response.data as Apparatus[];
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  loadAdjustmentForm() {
    this.adjustmentForm = new FormGroup({
      id: new FormControl(null),
      apparatus_id: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null, [Validators.required]),
    });

    if (this.dialogConfig.data) {
      const adjustment = this.dialogConfig.data as Adjustment;
      this.adjustmentForm.setValue({
        id: adjustment.id,
        apparatus_id: adjustment.apparatus_id,
        quantity: adjustment.quantity,
        type:
          (adjustment.type as string) == 'Stock-in'
            ? AdjustmentType.STOCK_IN
            : AdjustmentType.STOCK_OUT,
        remarks: adjustment.remarks,
      });
      this.adjustmentForm.updateValueAndValidity();
    }
  }

  onCreateAdjustment(data: Adjustment) {
    this.adjustmentService.createAdjustment(data).subscribe({
      next: (response: CommonSuccessResponse<Adjustment>) => {
        this.response = new CustomResponse<Adjustment>(
          response.data as Adjustment,
          [{ severity: 'info', summary: 'Adjustment item save successfully' }]
        );
      },
      error: (err) => {
        this.response = new CustomResponse<Adjustment>(err, [
          { severity: 'danger', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onUpdateAdjustment(data: Adjustment) {
    this.adjustmentService.updateAdjustment(data).subscribe({
      next: (response: CommonSuccessResponse<Adjustment>) => {
        this.response = new CustomResponse<Adjustment>(
          response.data as Adjustment,
          [{ severity: 'info', summary: 'Adjustment updated successfully' }]
        );
      },
      error: (err) => {
        this.response = new CustomResponse<Adjustment>(err, [
          { severity: 'danger', summary: err.error.message },
        ]);
      },
      complete: () => {
        this.dialogRef.close(this.response);
      },
    });
  }

  onSave() {
    if (this.adjustmentForm.valid) {
      const data = this.adjustmentForm.value as Adjustment;
      if (!this.dialogConfig.data) {
        this.onCreateAdjustment(data);
      } else {
        this.onUpdateAdjustment(data);
      }
    }
  }
}
