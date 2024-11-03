import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Adjustment } from '../models/adjustment.model';
import { AdjustmentType, Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { CommonSuccessResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AdjustmentService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Adjustment>
  ) {}

  getAllAdjustments(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.ADJUSTMENT}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const metadata = meta as Adjustment[];
          const data = metadata.map((stock: Adjustment) => ({
            ...stock,
            encoded_by: stock?.user?.name,
            unit: stock?.apparatus?.unit,
            apparatus_name: stock.apparatus?.apparatus_name,
            type:
              stock.type == AdjustmentType.STOCK_IN ? 'Stock-in' : 'Stock-out',
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Adjustment[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  createAdjustment(data: Adjustment) {
    return this.genericService.createRecord(
      `${Endpoints.ADJUSTMENT}`,
      data
    ) as Observable<CommonSuccessResponse<Adjustment>>;
  }

  updateAdjustment(data: Adjustment) {
    return this.genericService.updateRecord(`${Endpoints.ADJUSTMENT}`, data);
  }

  deleteAdjustment(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.ADJUSTMENT}`, id);
  }
}
