import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ApparatusService } from '../../../services/apparatus.service';
import { Apparatus } from '../../../models/apparatus.model';
import { CommonSuccessResponse } from '../../../models/response.model';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StockIn } from '../../../models/stock.model';
import { STOCK_SELECTION_MODE, StockMode } from '../../../enums/common.enum';

@Component({
  selector: 'app-apparatus-query',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    MessagesModule,
  ],
  templateUrl: './apparatus-query.component.html',
  styleUrl: './apparatus-query.component.scss',
  providers: [ApparatusService],
})
export class ApparatusQueryComponent implements OnInit {
  apparatus: Apparatus[] = [];
  selectedApparatus = new Apparatus();
  messages: Message[] = [];
  quantity: number = 0;
  constructor(
    private apparatusService: ApparatusService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.apparatusService.getActiveApparatus().subscribe({
      next: (response: CommonSuccessResponse<Apparatus[]>) => {
        this.apparatus = response.data as Apparatus[];
      },
      error: (error) => {
        throw new Error(error);
      },
    });
  }

  selectedProduct(event: any) {
    this.selectedApparatus = event.value as Apparatus;
  }

  validateField(): boolean {
    this.messages = [];
    if (!Object.entries(this.selectedApparatus).length) {
      this.messages = [
        { severity: 'error', summary: 'Please select apparatus' },
      ];
      return false;
    }
    if (
      this.selectedApparatus.quantity <= 0 &&
      this.dialogConfig.data === STOCK_SELECTION_MODE.OUT
    ) {
      this.messages = [
        {
          severity: 'error',
          summary:
            'Sorry we are not able to add the apparatus with low quantity',
        },
      ];
      return false;
    }
    return true;
  }

  selectProduct() {
    if (!this.validateField()) return;
    const data = {
      apparatus_id: this.selectedApparatus.id,
      apparatus: this.selectedApparatus,
      quantity: this.quantity,
    } as StockIn;
    this.dialogRef.close(data);
  }
}
