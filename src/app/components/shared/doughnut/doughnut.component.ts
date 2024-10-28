import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
})
export class DoughnutComponent implements OnInit {
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);
  chartData = [50, 30, 10, 10];
  backgroundColor = [
    this.documentStyle.getPropertyValue('--blue-500'),
    this.documentStyle.getPropertyValue('--blue-700'),
    this.documentStyle.getPropertyValue('--teal-500'),
    this.documentStyle.getPropertyValue('--red-500'),
  ];
  hoverBackgroundColor = [
    this.documentStyle.getPropertyValue('--blue-400'),
    this.documentStyle.getPropertyValue('--blue-600'),
    this.documentStyle.getPropertyValue('--teal-400'),
    this.documentStyle.getPropertyValue('--red-400'),
  ];
  labels = ['Ongoing', 'Outgoing', 'Adjustment', 'Expired'];
  ngOnInit(): void {
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
