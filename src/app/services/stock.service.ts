import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Stock, StockIn, StockOut } from '../models/stock.model';
import { Endpoints, StockMode } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { CommonSuccessResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Stock | StockOut | StockIn>
  ) {}

  getAllStockIn(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.STOCKS}/stock-in?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const metadata = meta as Stock[];
          const data = metadata.map((stock: Stock) => ({
            ...stock,
            user_name: stock?.user?.name,
            type: stock.type === 'STOCK_IN' ? 'STOCK IN' : 'STOCK OUT',
            quantity:
              stock.stock_in.reduce((curr, acc) => curr + acc.quantity, 0) ||
              stock.stock_out.reduce((curr, acc) => curr + acc.quantity, 0),
            number_of_items: stock.stock_in.length || stock.stock_out.length,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Stock[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  createStockIn(data: Stock) {
    return this.genericService.createRecord(
      `${Endpoints.STOCKS}/${StockMode.IN}`,
      data
    ) as Observable<CommonSuccessResponse<Stock>>;
  }

  createStockOut(data: Stock) {
    return this.genericService.createRecord(
      `${Endpoints.STOCKS}/${StockMode.OUT}`,
      data
    ) as Observable<CommonSuccessResponse<Stock>>;
  }

  getAllStockOut(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.STOCKS}/stock-out/paginate?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const metadata = meta as StockOut[];
          const data = metadata.map((stock: StockOut) => ({
            ...stock,
            transaction_no: stock.test?.transaction_number || null,
            apparatus_name: stock.apparatus?.apparatus_name || null,
            test_type: stock.test?.type || null,
            unit: stock.apparatus?.unit || null,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as StockOut[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getAllStockIncoming(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.STOCKS}/stock-in/paginate?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const metadata = meta as StockIn[];
          const data = metadata.map((stock: any) => ({
            ...stock,
            received_by: stock.stock?.user?.name || null,
            apparatus_name: stock.apparatus?.apparatus_name || null,
            unit: stock.apparatus?.unit || null,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as StockIn[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }
}
