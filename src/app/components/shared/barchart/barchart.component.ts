import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../../services/dashboard.service';
import { callback } from 'chart.js/dist/helpers/helpers.core';

interface IDataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
}

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss',
  providers: [DashboardService],
})
export class BarchartComponent implements OnInit {
  @Input() set max(value: number) {
    this.maxValue = value;
  }
  get max() {
    return this.maxValue;
  }
  maxValue = 0;
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  labels = [
    'Jan',
    'Feb',
    'Mar',
    'April',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  dataset = [
    {
      label: 'Urinalysis',
      backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
      borderColor: this.documentStyle.getPropertyValue('--blue-400'),
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'Chemistry',
      backgroundColor: this.documentStyle.getPropertyValue('--blue-700'),
      borderColor: this.documentStyle.getPropertyValue('--blue-600'),
      data: [28, 48, 40, 19, 86, 27, 90],
    },
    {
      label: 'Hematology',
      backgroundColor: this.documentStyle.getPropertyValue('--teal-600'),
      borderColor: this.documentStyle.getPropertyValue('--teal-500'),
      data: [38, 28, 54, 39, 36, 87, 60],
    },
  ];

  constructor(private dashboardService: DashboardService) {}

  getBackgroundColor(label: string) {
    switch (label) {
      case 'Urinalysis':
        return '--blue-500';
      case 'Chemistry':
        return '--blue-700';
      default:
        return '--teal-600';
    }
  }

  getBorderColor(label: string) {
    switch (label) {
      case 'Urinalysis':
        return '--blue-400';
      case 'Chemistry':
        return '--blue-600';
      default:
        return '--teal-500';
    }
  }

  onLoadChartData() {
    this.dashboardService.generateLaboratoryChartData().subscribe({
      next: (response: any) => {
        const data = response?.data || [];
        const dataset = data.map((item: any) => ({
          label: item.label,
          backgroundColor: this.documentStyle.getPropertyValue(
            this.getBackgroundColor(item.label)
          ),
          borderColor: this.documentStyle.getPropertyValue(
            this.getBorderColor(item.label)
          ),
          data: item.data,
        }));
        this.data = {
          labels: this.labels,
          datasets: dataset,
        };
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  ngOnInit(): void {
    this.onLoadChartData();
    this.onLoadOptions();
  }

  onLoadOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      borderRadius: 4,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          suggestedMin: 0,
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          max: this.max + 1,
          suggestedMin: 0,
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return Number.isInteger(value) ? value : '';
            },
          },
          grid: {
            display: true,
            drawBorder: false,
          },
        },
      },
    };
  }
}
