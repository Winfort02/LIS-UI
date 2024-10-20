import { Component, Input, OnInit } from '@angular/core';
import { Test } from '../../../models/test.model';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-feature-form-header',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './feature-form-header.component.html',
  styleUrl: './feature-form-header.component.scss',
})
export class FeatureFormHeaderComponent implements OnInit {
  @Input() test = new Test();

  ngOnInit(): void {}
}
