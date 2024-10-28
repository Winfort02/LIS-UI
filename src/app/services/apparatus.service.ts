import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Apparatus } from '../models/apparatus.model';
import { Endpoints } from '../enums/common.enum';
import { Pagination } from '../models/pagination.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApparatusService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Apparatus>
  ) {}

  createAppratus(data: Apparatus) {
    return this.genericService.createRecord(`${Endpoints.APPARATUS}`, data);
  }

  updateAppratus(data: Apparatus) {
    return this.genericService.updateRecord(`${Endpoints.APPARATUS}`, data);
  }

  getAllAppratus(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.APPARATUS}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const data = meta.map((apparatus: Apparatus) => ({
            ...apparatus,
            availability: apparatus.quantity ? 'Available' : 'Out of stock',
            isExpired: apparatus.status ? 'Active' : 'Expired',
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Apparatus[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getAppratusDetail(id: number) {
    return this.genericService.getRecordById(`${Endpoints.APPARATUS}/${id}`);
  }

  getActiveApparatus() {
    return this.genericService.getAll(`${Endpoints.APPARATUS}/list/active`);
  }
}
