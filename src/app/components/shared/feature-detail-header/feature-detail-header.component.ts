import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature-detail-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './feature-detail-header.component.html',
  styleUrl: './feature-detail-header.component.scss',
})
export class FeatureDetailHeaderComponent {
  @Output() onSave = new EventEmitter<string>();
  @Input() title = '';
  @Input() formId = '';
  @Input() showBackBtn = true;
  constructor(private commonService: CommonService, private router: Router) {}

  back() {
    this.router.navigate([`${this.commonService.previousUrl}`]);
  }

  save() {
    this.onSave.emit('save');
  }
}
