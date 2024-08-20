import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Output() menuButtonClick: EventEmitter<any> = new EventEmitter();
  @ViewChild('topbarMenu') topbarMenu!: ElementRef;
  dateToday: any = new Date();
  hide: boolean = true;

  constructor() {
    setInterval(() => {
      this.dateToday = new Date();
    }, 1000);
  }

  onMenuButtonClick(event: Event) {
    this.hide = !this.hide;
    this.menuButtonClick.emit();
    event.preventDefault();
  }

  ngOnInit(): void {}
}
