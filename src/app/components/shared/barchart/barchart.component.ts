import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CommonSuccessResponse } from '../../../models/response.model';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [ChartModule, CalendarModule, FormsModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss',
  providers: [],
})
export class BarchartComponent implements OnInit {
  @Output() selectedYear = new EventEmitter<Date>();
  @Input() response = signal<CommonSuccessResponse<any[]>>({
    data: [],
    statusCode: 500,
    success: false,
  });
  _response = computed(() => this.response());
  currentYear = new Date();
  maxDate = new Date();
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
  dataset: any = [];

  constructor() {
    effect(() => {
      this.onLoadChartData();
    });
  }

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

  onSelectYear() {
    this.selectedYear.emit(this.currentYear);
  }

  onLoadChartData() {
    this.dataset = this._response().data.map((item: any) => ({
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
      datasets: this.dataset,
    };
    this.onLoadOptions();
  }

  ngOnInit(): void {
    this.onLoadChartData();
  }

  getMax(): number[] {
    return this.dataset.map((item: any, index: any) => {
      let _max = 0;
      if (index == 0) {
        _max = Math.max(...item.data);
      } else if (index == 1 && _max < Math.max(...item.data)) {
        _max = Math.max(...item.data);
      } else if (index == 2 && _max < Math.max(...item.data)) {
        _max = Math.max(...item.data);
      }
      return _max;
    });
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
          max: Math.max(...this.getMax()) ?? Math.max(...this.getMax()) + 1,
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
