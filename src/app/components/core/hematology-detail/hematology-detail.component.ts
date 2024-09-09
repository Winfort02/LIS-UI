import { Component, OnInit, signal } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { FeatureDetailHeaderComponent } from '../../shared/feature-detail-header/feature-detail-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationUrl,
  ButtonColor,
  ButtonLabel,
} from '../../../enums/common.enum';
import { ButtonModule } from 'primeng/button';
import { Hematology } from '../../../models/hematology.model';
import { HematologyService } from '../../../services/hematology.service';
import { Subscription } from 'rxjs';
import { CommonSuccessResponse } from '../../../models/response.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-hematology-detail',
  standalone: true,
  imports: [
    MessagesModule,
    FeatureDetailHeaderComponent,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './hematology-detail.component.html',
  styleUrl: './hematology-detail.component.scss',
  providers: [HematologyService, DialogService],
})
export class HematologyDetailComponent implements OnInit {
  messages: Message[] = [];
  paramsId = parseInt(this.route.snapshot.params['id']);
  editBtnLabel = ButtonLabel.PRINT;
  isEdit = signal<boolean>(false);
  editBtnSeverity = ButtonColor.INFO;
  hematology = new Hematology();
  hematologySubsc!: Subscription;
  isLoaded = false;
  private dialogRef!: DynamicDialogRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hematologyService: HematologyService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.onLoadHematology();
  }

  print() {
    this.hematologyService.generateHemotology(this.paramsId).subscribe({
      next: (response) => {
        this.dialogRef = this.dialogService.open(PdfViewerComponent, {
          header: 'HEMATOLOGY PDF',
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
      error: (error) => {
        throw new Error(error);
      },
    });
  }

  onBack() {
    this.router.navigate([ApplicationUrl.HEMATOLOGY_LIST]);
  }

  onLoadHematology() {
    this.hematologySubsc = this.hematologyService
      .getHematologyById(this.paramsId)
      .subscribe({
        next: (response: CommonSuccessResponse<Hematology>) => {
          this.hematology = response.data as Hematology;
        },
        error: (errors) => {
          throw new Error(errors);
        },
        complete: () => {
          this.isLoaded = true;
        },
      });
  }
}
