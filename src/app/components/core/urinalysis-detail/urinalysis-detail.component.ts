import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureDetailHeaderComponent } from '../../shared/feature-detail-header/feature-detail-header.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationUrl,
  ButtonColor,
  ButtonLabel,
} from '../../../enums/common.enum';
import { Subscription } from 'rxjs';
import { UrinalysisService } from '../../../services/urinalysis.service';
import { CommonSuccessResponse } from '../../../models/response.model';
import { Urinalysis } from '../../../models/urinalysis.model';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-urinalysis-detail',
  standalone: true,
  imports: [FeatureDetailHeaderComponent, ButtonModule, InputTextModule],
  templateUrl: './urinalysis-detail.component.html',
  styleUrl: './urinalysis-detail.component.scss',
  providers: [UrinalysisService, DialogService],
})
export class UrinalysisDetailComponent implements OnInit, OnDestroy {
  paramsId: number = 0;
  editBtnSeverity = ButtonColor.INFO;
  editBtnLabel = ButtonLabel.PRINT;
  urinalysisSubscription!: Subscription;
  urinalysis = new Urinalysis();
  isLoaded = false;
  private dialogRef!: DynamicDialogRef;
  constructor(
    private route: ActivatedRoute,
    private urinalysisService: UrinalysisService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.paramsId = parseInt(this.route.snapshot.params['id'], 10);
    this.onLoadUrinalysis();
  }

  ngOnDestroy(): void {
    if (this.urinalysisSubscription) this.urinalysisSubscription.unsubscribe();
  }

  print() {
    this.urinalysisService.generateUrinalysis(this.paramsId).subscribe({
      next: (response) => {
        this.dialogRef = this.dialogService.open(PdfViewerComponent, {
          header: 'URINALYSIS PDF',
          width: '80%',
          style: { minWidth: '455px', maxWidth: '970px' },
          position: 'top',
          focusOnShow: false,
          data: response,
        });

        this.dialogRef.onClose.subscribe(() => {
          return;
        });
      },
      error: (err) => {
        throw new Error(err);
      },
    });
  }

  onLoadUrinalysis() {
    this.urinalysisSubscription = this.urinalysisService
      .getUrinalysisById(this.paramsId)
      .subscribe({
        next: (response: CommonSuccessResponse<Urinalysis>) => {
          this.urinalysis = response.data as Urinalysis;
        },
        error: (err) => {
          throw new Error(err);
        },
        complete: () => {
          this.isLoaded = true;
        },
      });
  }
}
