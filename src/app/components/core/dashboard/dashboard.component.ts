import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { BarchartComponent } from '../../shared/barchart/barchart.component';
import { DoughnutComponent } from '../../shared/doughnut/doughnut.component';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonSuccessResponse } from '../../../models/response.model';
import { Stats } from '../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, BarchartComponent, DoughnutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  stats = new Stats();
  ngOnInit(): void {
    this.onLoadStats();
  }

  onLoadStats() {
    this.dashboardService.countStats().subscribe({
      next: (response) => {
        const result = response as CommonSuccessResponse<Stats>;
        this.stats = result.data as Stats;
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }
}
