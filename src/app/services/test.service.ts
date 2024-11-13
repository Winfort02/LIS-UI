import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { GenericService } from './generic.service';
import { Test } from '../models/test.model';
import { Endpoints } from '../enums/common.enum';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { TestReport } from '../models/test-report.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<Test>
  ) {}

  getTestRecords(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService.getRecords(`${Endpoints.TEST}?${QUERY}`).pipe(
      map(({ response, meta }) => {
        const data = meta.map((test: Test) => ({
          ...test,
          patientName: `${test.patient?.first_name} ${test.patient?.last_name}`,
          isCompleted: test?.hematology
            ? 'Completed'
            : test?.urinalysis
            ? 'Completed'
            : test?.chemistry
            ? 'Completed'
            : 'Pending',
        }));
        return {
          currentPage: response.currentPage,
          nextPage: response.nextPage,
          prevPage: response.prevPage,
          lastPage: response.totalPages,
          totalPages: response.totalPages,
          firstPage: 1,
          metaData: data as Test[],
          pageDetails: `${response.currentPage} / ${response.totalPages}`,
        } as Pagination;
      })
    );
  }

  createTestRecord(data: Test) {
    return this.genericService.createRecord(`${Endpoints.TEST}`, data);
  }

  updateTestRecord(data: Test) {
    return this.genericService.updateRecord(`${Endpoints.TEST}`, data);
  }

  deleteTestRecord(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.TEST}`, id);
  }

  getTestRecordById(id: number) {
    return this.genericService.getRecordById(`${Endpoints.TEST}/${id}`);
  }

  getTestRecordByTransactionNo(transactionNo: string) {
    return this.genericService.getRecordById(
      `${Endpoints.TEST}/transaction/${transactionNo}`
    );
  }

  getPatientTestHistory(
    patientId: number,
    page: number,
    size: number,
    keywords: string
  ) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    return this.genericService
      .getRecords(`${Endpoints.TEST}/test-history/${patientId}?${QUERY}`)
      .pipe(
        map(({ response, meta }) => {
          const data = meta.map((test: Test) => ({
            ...test,
            patientName: `${test.patient?.first_name} ${test.patient?.last_name}`,
            isCompleted:
              test?.hematology || test?.urinalysis || test?.chemistry
                ? 'Completed'
                : 'Pending',
          }));
          return {
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            lastPage: response.totalPages,
            totalPages: response.totalPages,
            firstPage: 1,
            metaData: data as Test[],
            pageDetails: `${response.currentPage} / ${response.totalPages}`,
          } as Pagination;
        })
      );
  }

  getTestList() {
    return this.genericService.getAll(`${Endpoints.TEST}/test/list`);
  }

  generateTestReport(data: TestReport) {
    return this.genericService.generateTestReportPDF(
      `${Endpoints.REPORTS}/${Endpoints.TEST_REPORT}`,
      data
    );
  }
}
