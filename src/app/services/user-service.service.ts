import { Injectable } from '@angular/core';
import { CoreServiceService } from './core-service.service';
import { delay, finalize, map, shareReplay, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { CommonService } from './common.service';
import { Pagination } from '../models/pagination.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Endpoints } from '../enums/common.enum';

interface Login {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(
    private coreService: CoreServiceService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  login(data: Login) {
    this.spinner.show();
    return this.coreService.httpLogin(`${Endpoints.LOGIN}`, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  getUsers(page: number, size: number, keywords: string) {
    const QUERY = this.coreService.generateQueryParams(page, size, keywords);
    return this.coreService.httpGet(`${Endpoints.USERS}?${QUERY}`).pipe(
      take(1),
      shareReplay(),
      map((item: any) => {
        const response = item.data;
        const users: User[] = response.meta as User[];
        const meta = users.map((user: User) => ({
          ...user,
          createdAt: this.commonService.dateFormmater(user.createdAt as Date),
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

  createUser(data: User) {
    this.spinner.show();
    return this.coreService.httpPost(`${Endpoints.CREATE_USER}`, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  updateUser(data: User) {
    this.spinner.show();
    return this.coreService.httpPut(`${Endpoints.USERS}`, data).pipe(
      take(1),
      delay(1000),
      finalize(() => this.spinner.hide())
    );
  }

  deleteUser(id: number) {
    return this.coreService.httpDelete(`${Endpoints.USERS}`, id).pipe(take(1));
  }
}
