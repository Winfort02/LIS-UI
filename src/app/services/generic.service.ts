import { Injectable } from '@angular/core';
import { CoreServiceService } from './core-service.service';
import { delay, finalize, map, take } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonSuccessResponse } from '../models/response.model';
import { Login } from '../models/login.model';
import { StrategyMapping } from '../strategy/strategy-mapping.model';
import { CommonPropertyMapping } from '../interfaces/CommonMapping';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T extends CommonPropertyMapping> {
  constructor(
    private coreService: CoreServiceService,
    private spinner: NgxSpinnerService
  ) {}

  mapping = new StrategyMapping<T>();

  authenticate(url: string, data: Login) {
    this.spinner.show();
    return this.coreService.httpLogin(url, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getRecordWithDob(url: string) {
    return this.coreService.httpGet(url).pipe(
      take(1),
      map((item: any) => {
        const response = item.data || {};
        const data: T[] = response.meta as T[];
        const meta = this.mapping.dobMapping(data);
        return {
          response,
          meta,
        } as { response: Pagination; meta: T[] };
      })
    );
  }

  getRecords(url: string) {
    return this.coreService.httpGet(url).pipe(
      take(1),
      map((item: any) => {
        const response = item.data || {};
        const data: T[] = response.meta as T[];
        const meta = this.mapping.createdAtMapping(data);
        return {
          response,
          meta,
        } as { response: Pagination; meta: T[] };
      })
    );
  }

  createRecord(url: string, data: T) {
    this.spinner.show();
    return this.coreService.httpPost(url, data).pipe(
      take(1),
      delay(1000),
      map((item: any) => item as CommonSuccessResponse<T>),
      finalize(() => this.spinner.hide())
    );
  }

  updateRecord(url: string, data: T) {
    this.spinner.show();
    return this.coreService.httpPut(url, data).pipe(
      take(1),
      delay(1000),
      map((item: any) => item as CommonSuccessResponse<T>),
      finalize(() => this.spinner.hide())
    );
  }

  deleteRecord(url: string, id: number) {
    this.spinner.show();
    return this.coreService.httpDelete(url, id).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getRecordByIdWithDob(url: string) {
    this.spinner.show();
    return this.coreService.httpGet(url).pipe(
      take(1),
      map((item: any) => {
        const response = item.data as T;
        const data = this.mapping.dobSingleMapping(response);
        return {
          data,
          statusCode: item.statusCode,
          success: item.success,
        } as CommonSuccessResponse<T>;
      }),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getRecordById(url: string) {
    this.spinner.show();
    return this.coreService.httpGet(url).pipe(
      take(1),
      map((item: any) => {
        const response = item.data as T;
        const data = this.mapping.singleMapping(response);
        return {
          data,
          statusCode: item.statusCode,
          success: item.success,
        } as CommonSuccessResponse<T>;
      }),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getAll(url: string) {
    this.spinner.show();
    return this.coreService.httpGet(url).pipe(
      take(1),
      map((item: any) => {
        const response = item.data as T[];
        const data = this.mapping.createdAtMapping(response);
        return {
          data,
          statusCode: item.statusCode,
          success: item.success,
        } as CommonSuccessResponse<T>;
      }),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  generatePDF(url: string) {
    this.spinner.show();
    return this.coreService
      .httpGetReport(url)
      .pipe(finalize(() => this.spinner.hide()));
  }
}
