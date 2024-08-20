import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private debounceTime: any = null;
  @Input() placeholder = 'Search ...';
  @Output() search = new EventEmitter<string>();

  onSearch(event: any) {
    const keywords = event?.target?.value || '';
    if (this.debounceTime) {
      clearTimeout(this.debounceTime);
    }
    this.debounceTime = setTimeout(() => {
      this.search.emit(keywords);
    }, 500);
  }
}
