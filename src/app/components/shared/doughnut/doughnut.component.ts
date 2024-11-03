import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  providers: [],
})
export class DoughnutComponent implements OnInit {
  @Input() set _chartData(value: number[]) {
    this.chartData = value;
  }
  get _chartData() {
    return this.chartData;
  }
  chartData = [0, 0, 0];
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);
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

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadOptions();
  }

  onLoadData() {
    this.data = {
      labels: this.labels,
      datasets: [
        {
          data: this._chartData,
          backgroundColor: this.backgroundColor,
          hoverBackgroundColor: this.hoverBackgroundColor,
        },
      ],
    };
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
