import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Chemistry } from '../models/chemistry.model';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class ChemistryService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Chemistry>
  ) {}

  createChemistry(data: Chemistry) {
    return this.genericService.createRecord(`${Endpoints.CHEMSTRY}`, data);
  }

  updateChemistry(data: Chemistry) {
    return this.genericService.updateRecord(`${Endpoints.CHEMSTRY}`, data);
  }

  getAllChemistry(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.CHEMSTRY}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const data = meta.map((chemistry: Chemistry) => ({
            ...chemistry,
            transaction_number: chemistry.test?.transaction_number,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Chemistry[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getChemistryById(id: number) {
    return this.genericService.getRecordById(`${Endpoints.CHEMSTRY}/${id}`);
  }

  generateChemistryPDF(id: number) {
    return this.genericService.generatePDF(
      `${Endpoints.REPORTS}/${Endpoints.CHEMSTRY}/${id}`
    );
  }
}
