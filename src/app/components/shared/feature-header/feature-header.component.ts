import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-feature-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './feature-header.component.html',
  styleUrl: './feature-header.component.scss',
})
export class FeatureHeaderComponent implements OnInit {
  @Input() title!: string;
  @Input() buttonSize: string = 'small';
  @Output() onClickActionButton = new EventEmitter<string>();

  onClick() {
    this.onClickActionButton.emit('add');
  }
  ngOnInit(): void {}
}
