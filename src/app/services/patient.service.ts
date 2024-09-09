import { Injectable } from '@angular/core';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { Patient } from '../models/patient.model';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Patient>
  ) {}

  getPatients(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecordWithDob(`${Endpoints.PATIENTS}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
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

  createPatient(data: Patient) {
    return this.genericService.createRecord(`${Endpoints.PATIENTS}`, data);
  }

  getPatientById(id: number) {
    return this.genericService.getRecordByIdWithDob(
      `${Endpoints.PATIENTS}/${id}`
    );
  }

  updatePatient(data: Patient) {
    return this.genericService.updateRecord(`${Endpoints.PATIENTS}`, data);
  }

  deletePatient(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.PATIENTS}`, id);
  }

  getAllPatients() {
    return this.genericService.getAll(`${Endpoints.PATIENTS}/all/patients`);
  }
}
