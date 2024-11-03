import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureDetailHeaderComponent } from '../../shared/feature-detail-header/feature-detail-header.component';
import { ButtonColor, ButtonLabel } from '../../../enums/common.enum';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { Chemistry } from '../../../models/chemistry.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { ChemistryService } from '../../../services/chemistry.service';
import { InputTextModule } from 'primeng/inputtext';
import { CommonSuccessResponse } from '../../../models/response.model';
import { PdfViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-chemistry-detail',
  standalone: true,
  imports: [FeatureDetailHeaderComponent, ButtonModule, InputTextModule],
  templateUrl: './chemistry-detail.component.html',
  styleUrl: './chemistry-detail.component.scss',
  providers: [ChemistryService, DialogService, TokenService],
})
export class ChemistryDetailComponent implements OnInit, OnDestroy {
  paramsId: number = 0;
  editBtnSeverity = ButtonColor.INFO;
  editBtnLabel = ButtonLabel.PRINT;
  isLoaded = false;
  chemistrySubscription!: Subscription;
  chemistry = new Chemistry();
  isAdmin = this.tokenService.isAdmin();
  private dialogRef!: DynamicDialogRef;

  constructor(
    private route: ActivatedRoute,
    private chemistryService: ChemistryService,
    private dialogService: DialogService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.paramsId = parseInt(this.route.snapshot.params['id'], 10);
    this.onLoadChemistry();
  }

  ngOnDestroy(): void {
    this.chemistrySubscription && this.chemistrySubscription.unsubscribe();
  }

  print() {
    this.chemistryService.generateChemistryPDF(this.paramsId).subscribe({
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

  onLoadChemistry() {
    this.chemistrySubscription = this.chemistryService
      .getChemistryById(this.paramsId)
      .subscribe({
        next: (response: CommonSuccessResponse<Chemistry>) => {
          this.chemistry = response.data as Chemistry;
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
