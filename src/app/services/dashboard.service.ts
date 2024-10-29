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

  generateLaboratoryChartData() {
    return this.coreService.httpGet(
      `${Endpoints.DASHBOARD}/laboratory-chart-data`
    );
  }

  generateStockChartData() {
    return this.coreService.httpGet(`${Endpoints.DASHBOARD}/stock-chart-data`);
  }
}
