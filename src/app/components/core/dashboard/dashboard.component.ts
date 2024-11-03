import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { BarchartComponent } from '../../shared/barchart/barchart.component';
import { DoughnutComponent } from '../../shared/doughnut/doughnut.component';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonSuccessResponse } from '../../../models/response.model';
import { Stats } from '../../../models/dashboard.model';
import { forkJoin, Subscription } from 'rxjs';
import { Test } from '../../../models/test.model';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Apparatus } from '../../../models/apparatus.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    BarchartComponent,
    DoughnutComponent,
    FeatureTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private dashboardService: DashboardService) {}
  stats = new Stats();
  isLoaded = false;
  stasSubs: Subscription[] = [];
  test = signal<Test[]>([]);
  cols = signal<ITableColumn[]>([]);
  apparatus = signal<Apparatus[]>([]);
  stockControl: number[] = [];
  laboratory = signal<CommonSuccessResponse<any[]>>({
    data: [],
    statusCode: 200,
    success: false,
  });
  dashboardSubscription!: Subscription;
  laboratorySubscription!: Subscription;
  showActionBtn = {
    edit: false,
    delete: false,
  };
  currentYear = new Date();
  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.dashboardSubscription && this.dashboardSubscription.unsubscribe();
    this.laboratorySubscription && this.laboratorySubscription.unsubscribe();
  }

  loadDashboard() {
    this.dashboardSubscription = forkJoin({
      stats: this.dashboardService.countStats(), // count stats api
      latestTransaction: this.dashboardService.getLatestTransaction(), // latest transaction api
      lowQuantity: this.dashboardService.getLowQuantityApparatus(), // low quantity api
      stockControl: this.dashboardService.generateStockChartData(), // stock chart data api
      laboratories: this.dashboardService.generateLaboratoryChartData(
        this.currentYear
      ), // laboratory chart data api
    }).subscribe({
      next: ({
        stats,
        latestTransaction,
        lowQuantity,
        stockControl,
        laboratories,
      }) => {
        const count = stats as CommonSuccessResponse<Stats>;
        const transaction = latestTransaction as CommonSuccessResponse<Test>;
        const apparatus = lowQuantity as CommonSuccessResponse<Apparatus>;
        const stocks = stockControl as CommonSuccessResponse<number[]>;
        this.laboratory.set(laboratories as CommonSuccessResponse<any[]>);
        this.stats = count.data as Stats;
        this.apparatus.set(apparatus.data as Apparatus[]);
        this.stockControl = stocks.data as number[];

        // test
        const test = (transaction.data as Test[]).map((item: Test) => ({
          ...item,
          patientName: `${item.patient?.last_name}, ${item.patient?.first_name}`,
          isCompleted: item?.hematology
            ? 'Completed'
            : item?.urinalysis
            ? 'Completed'
            : item?.chemistry
            ? 'Completed'
            : 'Pending',
        }));
        this.test.set(test);
      },
      error: (err) => {
        throw new Error(err);
      },
      complete: () => {
        this.isLoaded = true;
        this.onLoadTableColumn();
      },
    });
  }

  onLoadLaboratory() {
    this.laboratorySubscription = this.dashboardService
      .generateLaboratoryChartData(this.currentYear)
      .subscribe({
        next: (response) => {
          this.laboratory.set(response as CommonSuccessResponse<any[]>);
        },
        error: (err) => {
          throw new Error(err);
        },
      });
  }

  onSelectYear(event: any) {
    this.currentYear = new Date(event);
    this.onLoadLaboratory();
  }

  onLoadTableColumn() {
    this.cols.set([
      { field: 'transaction_number', header: 'Transaction No' },
      { field: 'patientName', header: 'Patient' },
      { field: 'type', header: 'Test Type' },
      { field: 'isCompleted', header: 'Status' },
      { field: 'createdAt', header: 'Created Date' },
    ]);
  }
}
