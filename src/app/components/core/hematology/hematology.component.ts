import { Component, OnInit } from '@angular/core';
import { HematologyService } from '../../../services/hematology.service';

import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { SearchComponent } from '../../shared/search/search.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';

@Component({
  selector: 'app-test-order',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureHeaderComponent,
    SearchComponent,
    FeatureTableComponent,
  ],
  templateUrl: './hematology.component.html',
  styleUrl: './hematology.component.scss',
})
export class HematologyComponent implements OnInit {
  constructor(private testOrderService: HematologyService) {}
  messages: Message[] = [];

  add(event: string) {}

  onLoadTestOrders() {
    this.testOrderService.getAllHematologies(1, 12, '').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        throw new Error(err.error);
      },
    });
  }

  onSearch(event: any) {}

  onPaginatePage(event: any) {}

  onPageChange(event: any) {}

  onClickActionBtn(event: any) {}

  ngOnInit(): void {
    this.onLoadTestOrders();
  }
}
