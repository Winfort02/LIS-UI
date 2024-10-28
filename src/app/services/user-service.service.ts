import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { CommonService } from './common.service';
import { Pagination } from '../models/pagination.model';
import { Endpoints } from '../enums/common.enum';
import { GenericService } from './generic.service';

interface Login {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(
    private commonService: CommonService,
    private genericService: GenericService<User>
  ) {}

  login(data: Login) {
    return this.genericService.authenticate(`${Endpoints.LOGIN}`, data);
  }

  getUserRecords(page: number, size: number, keywords: string) {
    const QUERY = this.commonService.generateQueryParams(page, size, keywords);
    const URL = `${Endpoints.USERS}?${QUERY}`;
    return this.genericService.getRecords(URL).pipe(
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

  createUser(data: User) {
    return this.genericService.createRecord(`${Endpoints.CREATE_USER}`, data);
  }

  updateUser(data: User) {
    return this.genericService.updateRecord(`${Endpoints.USERS}`, data);
  }

  deleteUser(id: number) {
    return this.genericService.deleteRecord(`${Endpoints.USERS}`, id);
  }

  changePassword(data: User) {
    return this.genericService.changePassword(
      `${Endpoints.CHANGE_PASSWORD}`,
      data
    );
  }
}
