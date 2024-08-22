import { Injectable } from '@angular/core';
import { CoreServiceService } from './core-service.service';
import { Endpoints } from '../enums/common.enum';
import { delay, finalize, take, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './common.service';
import { Pagination } from '../models/pagination.model';
import { Hematology } from '../models/hematology.model';

@Injectable({
  providedIn: 'root',
})
export class HematologyService {
  constructor(
    private coreService: CoreServiceService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
  ) {}

  createHematology(data: Hematology) {
    this.spinner.show();
    return this.coreService.httpPost(`${Endpoints.HEMATOLOGY}`, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  updateHematology(data: Hematology) {
    this.spinner.show();
    return this.coreService.httpPut(`${Endpoints.HEMATOLOGY}`, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  deleteHematology(id: number) {
    this.spinner.show();
    return this.coreService.httpDelete(`${Endpoints.HEMATOLOGY}`, id).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getAllHematologies(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.coreService.httpGet(`${Endpoints.HEMATOLOGY}?${QUERY}`).pipe(
      take(1),
      map((item: any) => {
        const response = item.data || {};
        const hematologies: Hematology[] = response.meta as Hematology[];
        const meta = hematologies.map((hematology: Hematology) => ({
          ...hematology,
          createdAt: this.commonService.dateFormmater(
            hematology.createdAt as Date
          ),
        }));
        return {
          currentPage: response.currentPage,
          nextPage: response.nextPage,
          prevPage: response.prevPage,
          lastPage: response.totalPages,
          totalPages: response.totalPages,
          firstPage: 1,
          metaData: meta,
          pageDetails: `${response.currentPage} / ${response.totalPages}`,
        } as Pagination;
      })
    );
  }

  getTestOrderById(id: number) {}
}
