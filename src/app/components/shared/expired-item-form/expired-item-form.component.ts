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
import { ApparatusService } from '../../../services/apparatus.service';
import {
  CommonSuccessResponse,
  CustomResponse,
} from '../../../models/response.model';
import { Apparatus } from '../../../models/apparatus.model';
import { ExpiredItems } from '../../../models/expired-items.model';
import { ExpireItemService } from '../../../services/expire-item.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expired-item-form',
  standalone: true,
  imports: [DropdownModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './expired-item-form.component.html',
  styleUrl: './expired-item-form.component.scss',
  providers: [ApparatusService, ExpireItemService],
})
export class ExpiredItemFormComponent implements OnInit, OnDestroy {
  options: Apparatus[] = [];
  expireFormItem!: FormGroup;
  response = new CustomResponse(new ExpiredItems(), []);
  apparatusSub!: Subscription;
  constructor(
    private apparatusService: ApparatusService,
    private expiredItemService: ExpireItemService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.onLoadApparatus();
    this.onLoadForm();
  }

  ngOnDestroy(): void {
    this.apparatusSub && this.apparatusSub.unsubscribe();
  }

  onLoadForm() {
    this.expireFormItem = new FormGroup({
      id: new FormControl(null),
      apparatus_id: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null, [Validators.required]),
    });

    if (this.dialogConfig.data) {
      const epxiredItem = this.dialogConfig.data as ExpiredItems;
      this.expireFormItem.setValue({
        id: epxiredItem.id,
        apparatus_id: epxiredItem.apparatus_id,
        quantity: epxiredItem.quantity,
        remarks: epxiredItem.remarks,
      });
    }
  }

  onCreateExpiredItem() {
    this.expiredItemService
      .createExpiredItem(this.expireFormItem.value as ExpiredItems)
      .subscribe({
        next: (response: CommonSuccessResponse<ExpiredItems>) => {
          this.response = new CustomResponse<ExpiredItems>(
            response.data as ExpiredItems,
            [{ severity: 'info', summary: 'Expired item save successfully' }]
          );
        },
        error: (err) => {
          this.response = new CustomResponse<ExpiredItems>(err, [
            { severity: 'danger', summary: err.error.message },
          ]);
        },
        complete: () => {
          this.dialogRef.close(this.response);
        },
      });
  }

  onUpdateExpiredItem() {
    this.expiredItemService
      .updateExpiredItem(this.expireFormItem.value as ExpiredItems)
      .subscribe({
        next: (response: CommonSuccessResponse<ExpiredItems>) => {
          this.response = new CustomResponse<ExpiredItems>(
            response.data as ExpiredItems,
            [{ severity: 'info', summary: 'Expired item save successfully' }]
          );
        },
        error: (err) => {
          this.response = new CustomResponse<ExpiredItems>(err, [
            { severity: 'danger', summary: err.error.message },
          ]);
        },
        complete: () => {
          this.dialogRef.close(this.response);
        },
      });
  }

  onSave() {
    if (this.expireFormItem.valid) {
      if (!this.dialogConfig.data) {
        this.onCreateExpiredItem();
      } else {
        this.onUpdateExpiredItem();
      }
    }
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
}
