import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-feature-detail-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './feature-detail-header.component.html',
  styleUrl: './feature-detail-header.component.scss',
})
export class FeatureDetailHeaderComponent {
  @Output() onBack = new EventEmitter<string>();
  @Output() onSave = new EventEmitter<string>();
  @Input() title = '';
  @Input() formId = '';
  @Input() showBackBtn = true;

  back() {
    this.onBack.emit('back');
  }

  save() {
    this.onSave.emit('save');
  }
}
