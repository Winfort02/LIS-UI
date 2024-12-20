import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { CommonService } from './common.service';
import { LocalKeys } from '../enums/common.enum';
import { CommonHelper } from '../helpers/common.helper';
import { ConfirmationService } from 'primeng/api';
import { throwError } from 'rxjs';

const API_URL = 'http://127.0.0.1:3000/api';

@Injectable({
  providedIn: 'root',
})
export class CoreServiceService {
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) {}

  commonHelper = new CommonHelper<any>();

  generateHttpOptions(token: string | null) {
    return {
      headers: new HttpHeaders({
        'content-type': ['application/json'],
        authorization: `Bearer ${token}`,
      }),
    };
  }
  generatePDFOption(token: string | null): any {
    return {
      headers: new HttpHeaders({
        'content-type': ['application/json'],
        authorization: `Bearer ${token}`,
      }),
      responseType: 'blob',
    };
  }

  httpLogin(endpoint: string, data: any) {
    return this.http.post(`${API_URL}/${endpoint}`, data).pipe(
      tap((data: any) => {
        const response = data;
        localStorage.setItem(
          LocalKeys.accessToken,
          response?.data?.token || null
        );
        this.commonService.accessToken = localStorage.getItem(
          LocalKeys.accessToken
        );
      })
    );
  }

  httpChangePassword(endpoint: string, data: any) {
    return this.http.put(
      `${API_URL}/${endpoint}`,
      data,
      this.generateHttpOptions(this.commonService.accessToken())
    );
  }

  httpGetReport(endpoint: string) {
    return this.http.get(
      `${API_URL}/${endpoint}`,
      this.generatePDFOption(this.commonService.accessToken())
    );
  }
  httpPostReport(endpoint: string, data: any) {
    return this.http.post(
      `${API_URL}/${endpoint}`,
      data,
      this.generatePDFOption(this.commonService.accessToken())
    );
  }

  httpGet(endpoint: string) {
    return this.http
      .get(
        `${API_URL}/${endpoint}`,
        this.generateHttpOptions(this.commonService.accessToken())
      )
      .pipe(catchError((error) => this.httpErrorHandler(error)));
  }

  httpPost(endpoint: string, data: any) {
    return this.http.post(
      `${API_URL}/${endpoint}`,
      data,
      this.generateHttpOptions(this.commonService.accessToken())
    );
  }

  httpPut(endpoint: string, data: any) {
    return this.http.put(
      `${API_URL}/${endpoint}/${data.id}`,
      data,
      this.generateHttpOptions(this.commonService.accessToken())
    );
  }

  httpDelete(endpoint: string, id: number) {
    return this.http.delete(
      `${API_URL}/${endpoint}/${id}`,
      this.generateHttpOptions(this.commonService.accessToken())
    );
  }

  httpErrorHandler(error: HttpErrorResponse) {
    if (
      (error.status === 401 || error.status == 403) &&
      this.commonService.isLogin()
    ) {
      this.confirmationService.confirm({
        ...this.commonHelper.commonConfrimation(),
        message: 'Session expired please login again.',
        acceptLabel: 'Ok',
        acceptButtonStyleClass: 'p-button-info',
        accept: () => {
          localStorage.clear();
          location.reload();
        },
      });
    }

    return throwError(error);
  }
}
