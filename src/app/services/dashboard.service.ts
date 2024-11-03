import { Injectable } from '@angular/core';
import { CoreServiceService } from './core-service.service';
import { Endpoints } from '../enums/common.enum';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private coreService: CoreServiceService) {}

  countStats() {
    return this.coreService.httpGet(`${Endpoints.DASHBOARD}`);
  }

  generateLaboratoryChartData(date: Date) {
    return this.coreService.httpGet(
      `${Endpoints.DASHBOARD}/laboratory-chart-data?currentDate=${date}`
    );
  }

  generateStockChartData() {
    return this.coreService.httpGet(`${Endpoints.DASHBOARD}/stock-chart-data`);
  }

  getLatestTransaction() {
    return this.coreService.httpGet(
      `${Endpoints.DASHBOARD}/latest-transaction`
    );
  }

  getLowQuantityApparatus() {
    return this.coreService.httpGet(
      `${Endpoints.DASHBOARD}/low-quanitity-apparatus`
    );
  }
}
