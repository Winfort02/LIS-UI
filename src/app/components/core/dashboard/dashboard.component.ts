import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { BarchartComponent } from '../../shared/barchart/barchart.component';
import { DoughnutComponent } from '../../shared/doughnut/doughnut.component';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonSuccessResponse } from '../../../models/response.model';
import { Stats } from '../../../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, BarchartComponent, DoughnutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private dashboardService: DashboardService) {}
  stats = new Stats();
  isLoaded = false;
  stasSubs!: Subscription;
  ngOnInit(): void {
    this.onLoadStats();
  }
  ngOnDestroy(): void {
    this.stasSubs && this.stasSubs.unsubscribe();
  }

  onLoadStats() {
    this.stasSubs = this.dashboardService.countStats().subscribe({
      next: (response) => {
        const result = response as CommonSuccessResponse<Stats>;
        this.stats = result.data as Stats;
        this.isLoaded = true;
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }
}
