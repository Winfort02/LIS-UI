import { DatePipe } from '@angular/common';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { LocalKeys } from '../enums/common.enum';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _accessToken = signal<string | null>(
    localStorage.getItem(LocalKeys.accessToken)
  );
  constructor(private datePipe: DatePipe) {}

  set accessToken(token: string | null) {
    this._accessToken.set(token);
  }

  get accessToken(): Signal<string | null> {
    return computed(() => this._accessToken());
  }

  isLogin() {
    return !!this.accessToken();
  }

  dateFormmater(date: Date) {
    return this.datePipe.transform(new Date(date), 'EEEE, MM-dd-yyyy H:mm a');
  }

  dobFormat(date: Date) {
    return this.datePipe.transform(new Date(date), 'dd-MM-yyyy');
  }

  dateParser(date: string) {
    // Split the string into day, month, and year
    const [day, month, year] = date.split('-').map(Number);

    // Note: JavaScript Date months are 0-based (0 for January, 1 for February, etc.)
    return new Date(year, month - 1, day);
  }

  formatDateRequest(date: Date) {
    let d = new Date(date);
    if (typeof date == 'string') d = this.dateParser(date);
    return this.datePipe.transform(d.toUTCString(), 'yyyy-MM-dd') || '';
  }
}
