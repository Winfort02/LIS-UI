import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreServiceService } from './services/core-service.service';
import { DatePipe } from '@angular/common';
import { CommonService } from './services/common.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';

export const APP_PROVIDER = [
  CoreServiceService,
  DatePipe,
  CommonService,
  ConfirmationService,
  MessageService,
  NgxSpinnerService,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'LIS-UI';
}
