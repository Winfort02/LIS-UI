import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { FeatureHeaderComponent } from '../../shared/feature-header/feature-header.component';
import { FeatureTableComponent } from '../../shared/feature-table/feature-table.component';
import { UserServiceService } from '../../../services/user-service.service';
import { User } from '../../../models/user.model';
import { ITableColumn } from '../../../interfaces/table-column.interface';
import { Pagination } from '../../../models/pagination.model';
import { ActionButtonType, EPagination } from '../../../enums/common.enum';

import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { Subscription } from 'rxjs';
import { CustomResponse } from '../../../models/response.model';
import { CommonHelper } from '../../../helpers/common.helper';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FeatureHeaderComponent,
    FeatureTableComponent,
    DynamicDialogModule,
    MessagesModule,
    SearchComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [UserServiceService, DialogService],
})
export class UserComponent implements OnInit, OnDestroy {
  cols = signal<ITableColumn[]>([]);
  users = signal<User[]>([]);
  pagination = signal<Pagination>(new Pagination());
  selectedPage = signal<number>(1);
  size = 25;
  keywords = signal<string>('');
  userSubscription!: Subscription;
  messages: Message[] = [];
  commonHelper = new CommonHelper<User>();

  private dialogRef!: DynamicDialogRef;

  constructor(
    private userService: UserServiceService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    effect(() => {
      if (this.userSubscription) {
        this.userSubscription;
      }
      this.onLoadUserData(this.selectedPage());
    });
  }

  add(event: string) {
    if (event === ActionButtonType.add) {
      this.dialogRef = this.dialogService.open(
        UserDetailComponent,
        this.commonHelper.commonDialogOption()
      );

      this.dialogRef.onClose.subscribe((response: CustomResponse<User>) => {
        if (response) {
          this.messages = response.message;
          this.onLoadUserData(this.pagination().currentPage);
        }
      });
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'Record deleted',
        });
      },
      error: (errors) => {
        this.messageService.add({
          severity: 'error',
          detail: errors?.error?.message,
        });
      },
      complete: () => {
        this.onLoadUserData(this.pagination().currentPage);
      },
    });
  }

  onDeleteUser(id: number) {
    this.confirmationService.confirm({
      ...this.commonHelper.commonConfrimation(),
      accept: () => {
        this.deleteUser(id);
      },
    });
  }

  onClickActionBtn(event: { type: string; data: any }) {
    if (event.type === ActionButtonType.edit) {
      this.dialogRef = this.dialogService.open(
        UserDetailComponent,
        this.commonHelper.commonDialogOption(event.data)
      );

      this.dialogRef.onClose.subscribe((response: CustomResponse<User>) => {
        if (response) {
          this.messages = response.message;
          this.onLoadUserData(this.pagination().currentPage);
        }
      });
    }

    if (event.type === ActionButtonType.delete) {
      this.onDeleteUser(event.data.id);
    }
  }

  getAllUsers(page: number) {
    this.userSubscription = this.userService
      .getUserRecords(page, this.size, this.keywords())
      .subscribe({
        next: (response: Pagination) => {
          this.pagination.set(response);
          this.users.set(response.metaData);
        },
        error: (error) => {
          throw new Error(error);
        },
      });
  }

  onLoadUserData(page: number) {
    this.getAllUsers(page);
  }

  onLoadUserColumns() {
    this.cols.set([
      {
        field: 'name',
        header: 'Name',
      },
      {
        field: 'email',
        header: 'Email',
      },
      {
        field: 'role',
        header: 'Role',
      },
      {
        field: 'createdAt',
        header: 'Created Date',
      },
    ]);
  }

  onPaginatePage(event: string) {
    if (event === EPagination.first)
      this.onLoadUserData(this.pagination().firstPage);
    if (event === EPagination.next)
      this.onLoadUserData(this.pagination().nextPage);
    if (event === EPagination.prev)
      this.onLoadUserData(this.pagination().prevPage);
    if (event === EPagination.last)
      this.onLoadUserData(this.pagination().lastPage);
  }

  onPageChange(event: number) {
    this.selectedPage.set(event);
  }

  onSearch(event: string) {
    this.keywords.set(event);
  }

  ngOnInit(): void {
    this.onLoadUserColumns();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
