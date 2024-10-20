import { Injectable } from '@angular/core';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Pagination } from '../models/pagination.model';
import { Hematology } from '../models/hematology.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class HematologyService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Hematology>
  ) {}

  createHematology(data: Hematology) {
    return this.genericService.createRecord(`${Endpoints.HEMATOLOGY}`, data);
  }

  updateHematology(data: Hematology) {
    return this.genericService.updateRecord(`${Endpoints.HEMATOLOGY}`, data);
  }

  deleteHematology(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.HEMATOLOGY}`, id);
  }

  getAllHematologies(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.HEMATOLOGY}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const data = meta.map((hematology: Hematology) => ({
            ...hematology,
            transaction_number: hematology.test?.transaction_number,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Hematology[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getHematologyById(id: number) {
    return this.genericService.getRecordById(`${Endpoints.HEMATOLOGY}/${id}`);
  }

  generateHemotology(id: number) {
    return this.genericService.generatePDF(
      `${Endpoints.REPORTS}/${Endpoints.HEMATOLOGY}/${id}`
    );
  }
}
