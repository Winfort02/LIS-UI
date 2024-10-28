import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss',
})
export class BarchartComponent implements OnInit {
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    this.data = {
      labels: this.labels,
      datasets: this.dataset,
    };
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
          ticks: {
            color: textColorSecondary,
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
