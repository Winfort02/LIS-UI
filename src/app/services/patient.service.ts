import { Injectable } from '@angular/core';
import { CoreServiceService } from './core-service.service';
import { Endpoints } from '../enums/common.enum';
import { delay, finalize, map, shareReplay, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination } from '../models/pagination.model';
import { Patient } from '../models/patient.model';
import { CommonService } from './common.service';
import { CommonSuccessResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(
    private coreService: CoreServiceService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  getPatients(page: number, size: number, keywords: string) {
    const QUERY = this.coreService.generateQueryParams(page, size, keywords);
    return this.coreService.httpGet(`${Endpoints.PATIENTS}?${QUERY}`).pipe(
      take(1),
      shareReplay(),
      map((item: any) => {
        const response = item.data || {};
        const patients: Patient[] = response.meta as Patient[];
        const meta = patients.map((patient: Patient) => ({
          ...patient,
          date_of_birth: this.commonService.dobFormat(patient.date_of_birth),
          createdAt: this.commonService.dateFormmater(
            patient.createdAt as Date
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

  createPatient(data: Patient) {
    this.spinner.show();
    return this.coreService.httpPost(`${Endpoints.PATIENTS}`, data).pipe(
      take(1),
      map((item: any) => item as CommonSuccessResponse<Patient>),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getPatientById(id: number) {
    this.spinner.show();
    return this.coreService.httpGet(`${Endpoints.PATIENTS}/${id}`).pipe(
      take(1),
      map((item: any) => {
        const response = item.data || {};
        return {
          ...response,
          date_of_birth: this.commonService.dobFormat(response.date_of_birth),
        } as Patient;
      }),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  updatePatient(data: Patient) {
    this.spinner.show();
    return this.coreService.httpPut(`${Endpoints.PATIENTS}`, data).pipe(
      take(1),
      delay(1000),
      map((item: any) => {
        const response = item.data || {};
        return {
          ...response,
          date_of_birth: this.commonService.dobFormat(response.date_of_birth),
        } as Patient;
      }),
      finalize(() => this.spinner.hide())
    );
  }

  deletePatient(id: number) {
    this.spinner.show();
    return this.coreService.httpDelete(`${Endpoints.PATIENTS}`, id).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }
}
