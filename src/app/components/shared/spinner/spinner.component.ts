import { Component } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}
