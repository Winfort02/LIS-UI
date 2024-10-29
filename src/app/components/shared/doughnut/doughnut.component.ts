import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  providers: [DashboardService],
})
export class DoughnutComponent implements OnInit {
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);
  chartData = [0, 0, 0];
  backgroundColor = [
    this.documentStyle.getPropertyValue('--teal-500'),
    this.documentStyle.getPropertyValue('--blue-700'),
    this.documentStyle.getPropertyValue('--red-500'),
    this.documentStyle.getPropertyValue('--blue-500'),
  ];
  hoverBackgroundColor = [
    this.documentStyle.getPropertyValue('--teal-400'),
    this.documentStyle.getPropertyValue('--blue-600'),
    this.documentStyle.getPropertyValue('--red-400'),
    this.documentStyle.getPropertyValue('--blue-400'),
  ];
  labels = ['Incoming', 'Outgoing', 'Expired', 'Adjustment'];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadOptions();
  }

  onLoadData() {
    this.dashboardService.generateStockChartData().subscribe({
      next: (response: any) => {
        this.chartData = response.data;
        this.data = {
          labels: this.labels,
          datasets: [
            {
              data: this.chartData,
              backgroundColor: this.backgroundColor,
              hoverBackgroundColor: this.hoverBackgroundColor,
            },
          ],
        };
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  onLoadOptions() {
    this.options = {
      cutout: '60%',
      borderWidth: 6,
      borderRadius: 2,
      hoverBorderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
        },
      },
    };
  }
}
