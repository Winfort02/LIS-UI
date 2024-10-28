import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Stock, StockIn } from '../../../models/stock.model';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApparatusQueryComponent } from '../apparatus-query/apparatus-query.component';
import { CommonHelper } from '../../../helpers/common.helper';
import { StockItemService } from '../../../services/stock-item.service';
import { StockItem } from '../../../models/stock-item.model';
import { STOCK_SELECTION_MODE, StockMode } from '../../../enums/common.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../services/stock.service';
import { CommonSuccessResponse } from '../../../models/response.model';
import { DropdownModule } from 'primeng/dropdown';
import { IDropdownOption } from '../../../interfaces/dropdown-option.interface';
import { STOCK_TYPE } from '../../../helpers/constant.helper';
import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test.model';

@Component({
  selector: 'app-stock-item-form',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './stock-item-form.component.html',
  styleUrl: './stock-item-form.component.scss',
  providers: [DialogService, StockItemService, TestService],
})
export class StockItemFormComponent implements OnInit {
  stockItems!: StockIn[];
  dialogRef!: DynamicDialogRef;
  commonHelper = new CommonHelper<any>();
  mode!: StockMode;
  type: string = '';
  options: IDropdownOption[] = STOCK_TYPE;
  testOptions: Test[] = [];
  test = new Test();
  constructor(
    private dialogService: DialogService,
    private stockItemService: StockItemService,
    private route: ActivatedRoute,
    private stockService: StockService,
    private router: Router,
    private testService: TestService
  ) {
    this.stockItemService.stocks.subscribe((_stockItem: StockItem) => {
      this.stockItems = _stockItem.stocks;
    });
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.params['mode'] as StockMode;
  }

  onSelectTest(event: any) {
    this.test = event.value as Test;
  }

  onSelectType(event: any) {
    if (event.value === STOCK_SELECTION_MODE.OUT) {
      this.onTestLoad();
    }
  }

  onTestLoad() {
    if (!this.testOptions.length) {
      this.testService.getTestList().subscribe({
        next: (response: CommonSuccessResponse<Test[]>) => {
          this.testOptions = response.data as Test[];
        },
        error: (err) => {
          throw new Error(err);
        },
      });
    }
  }

  productQuery() {
    this.dialogRef = this.dialogService.open(ApparatusQueryComponent, {
      ...this.commonHelper.commonDialogOption(this.type),
      header: 'Select Apparatus',
      contentStyle: { overflow: 'visible' },
    });
    this.dialogRef.onClose.subscribe((data: StockIn) => {
      if (data) this.stockItemService.addItem(data, data.quantity);
    });
  }

  onRemoveQty(item: StockIn) {
    this.stockItemService.removeQty(item);
  }

  onAddQty(item: StockIn) {
    this.stockItemService.addItem(item);
  }

  removeItemFromList(item: StockIn) {
    this.stockItemService.removeFromCart(item);
  }

  onClearList() {
    this.stockItemService.onClearCart();
  }

  prepareStockInPayload() {
    return {
      type: this.type,
      stock_in: this.stockItems.map((item) => ({
        apparatus_id: item.apparatus_id,
        quantity: item.quantity,
      })),
    } as Stock;
  }

  prepareStockOutPayload() {
    return {
      type: this.type,
      stock_out: this.stockItems.map((item) => ({
        apparatus_id: item.apparatus_id,
        quantity: item.quantity,
        test_id: this.test.id,
      })),
    } as Stock;
  }

  onCreateStockIn() {
    const data = this.prepareStockInPayload();
    this.stockService.createStockIn(data).subscribe({
      next: (response: CommonSuccessResponse<Stock>) => {
        if (response.success) {
          this.onClearList();
          this.router.navigate([`application/stocks`]);
        }
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  onCreateStockOut() {
    const data = this.prepareStockOutPayload();
    this.stockService.createStockOut(data).subscribe({
      next: (response: CommonSuccessResponse<Stock>) => {
        if (response.success) {
          this.onClearList();
          this.router.navigate([`/application/stocks`]);
        }
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  onSave() {
    switch (this.type) {
      case STOCK_SELECTION_MODE.IN:
        this.onCreateStockIn();
        break;
      case STOCK_SELECTION_MODE.OUT:
        this.onCreateStockOut();
        break;
    }
  }
}
