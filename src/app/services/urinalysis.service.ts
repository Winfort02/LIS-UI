import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Urinalysis } from '../models/urinalysis.model';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class UrinalysisService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Urinalysis>
  ) {}

  createUrinalysis(data: Urinalysis) {
    return this.genericService.createRecord(`${Endpoints.URINALYSIS}`, data);
  }

  updateUrinalysis(data: Urinalysis) {
    return this.genericService.updateRecord(`${Endpoints.URINALYSIS}`, data);
  }

  deleteUrinalysis(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.URINALYSIS}`, id);
  }

  getAllUrinalysis(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.URINALYSIS}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const data = meta.map((urinalysis: Urinalysis) => ({
            ...urinalysis,
            transaction_number: urinalysis.test?.transaction_number,
            patientName: `${urinalysis.test?.patient?.first_name} ${urinalysis.test?.patient?.middle_name} ${urinalysis.test?.patient?.last_name}`,
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Urinalysis[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getUrinalysisById(id: number) {
    return this.genericService.getRecordById(`${Endpoints.URINALYSIS}/${id}`);
  }

  generateUrinalysis(id: number) {
    return this.genericService.generatePDF(
      `${Endpoints.REPORTS}/urinalysis/${id}`
    );
  }
}
