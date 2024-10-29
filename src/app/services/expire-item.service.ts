import { Injectable } from '@angular/core';
import { ExpiredItems } from '../models/expired-items.model';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { CommonSuccessResponse } from '../models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpireItemService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<ExpiredItems>
  ) {}

  getAllExpiredItems(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService.getRecords(`${Endpoints.EXPIRED}?${QUERY}`).pipe(
      map(({ response, meta }) => {
        const metadata = meta as ExpiredItems[];
        const data = metadata.map((stock: ExpiredItems) => ({
          ...stock,
          encoded_by: stock?.user?.name,
          unit: stock?.apparatus?.unit,
          apparatus_name: stock.apparatus?.apparatus_name,
        }));
        return {
          currentPage: response.currentPage,
          nextPage: response.nextPage,
          prevPage: response.prevPage,
          lastPage: response.totalPages,
          totalPages: response.totalPages,
          firstPage: 1,
          metaData: data as ExpiredItems[],
          pageDetails: `${response.currentPage} / ${response.totalPages}`,
        } as Pagination;
      })
    );
  }

  createExpiredItem(data: ExpiredItems) {
    return this.genericService.createRecord(
      `${Endpoints.EXPIRED}`,
      data
    ) as Observable<CommonSuccessResponse<ExpiredItems>>;
  }

  updateExpiredItem(data: ExpiredItems) {
    return this.genericService.updateRecord(`${Endpoints.EXPIRED}`, data);
  }

  deleteExpiredItem(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.EXPIRED}`, id);
  }
}
