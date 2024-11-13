import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { CommonHelper } from '../../../helpers/common.helper';
import { User } from '../../../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { ApplicationUrl, Icon, LocalKeys } from '../../../enums/common.enum';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../../core/change-password/change-password.component';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
  providers: [DialogService, TokenService],
})
export class SidebarComponent implements OnInit {
  @Input() active!: boolean;
  position: string = '';
  activeSubmenus: { [key: string]: boolean } = {};
  sideItems: MenuItem[] = [];
  scrollable = true;
  commonHelper = new CommonHelper<User>();
  user: User | null = this.tokenService.decodeAccessToken();

  dialogRef!: DynamicDialogRef;
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private dialogService: DialogService,
    private tokenService: TokenService
  ) {}

  toggleSideMenu(event: Event, name: string) {
    this.activeSubmenus[name] = this.activeSubmenus[name] ? false : true;
    event.preventDefault();
  }

  toggleSubmenuActive(name: string) {
    if (this.activeSubmenus.hasOwnProperty(name)) {
      return this.activeSubmenus[name];
    } else if (this.router.isActive(name, false)) {
      this.activeSubmenus[name] = true;
      return true;
    }
    return false;
  }

  onActiveState(link: string) {
    if (this.router.url.indexOf(link) === -1) {
      return false;
    }
    return true;
  }

  onLoadSideMenuItems() {
    this.sideItems = [
      {
        label: 'Dashboard',
        icon: Icon.DASHBOARD,
        routerLink: ApplicationUrl.APPLICATION,
        visible: this.tokenService.isAdmin(),
      },
      {
        label: 'Users',
        icon: Icon.USER,
        routerLink: ApplicationUrl.USERS,
        visible: this.tokenService.isAdmin(),
      },
      {
        label: 'Patients',
        icon: Icon.PATIENT,
        routerLink: ApplicationUrl.PATIENTS,
      },
      {
        label: 'Apparatus',
        icon: Icon.TOOL,
        routerLink: ApplicationUrl.APPARATUS,
      },
      {
        label: 'Tests',
        icon: Icon.TEST,
        routerLink: ApplicationUrl.TEST,
      },
      {
        label: 'Stocks',
        icon: Icon.STOCK,
        routerLink: ApplicationUrl.STOCK,
      },
      {
        label: 'Laboratory',
        items: [
          {
            label: 'Hematology',
            icon: Icon.RESULT,
            routerLink: ApplicationUrl.HEMATOLOGY,
          },
          {
            label: 'Urinalysis',
            icon: Icon.RESULT,
            routerLink: ApplicationUrl.URINALYSIS,
          },
          {
            label: 'Chemistry',
            icon: Icon.RESULT,
            routerLink: ApplicationUrl.CHEMSTRY,
          },
        ],
      },
      {
        label: 'Inventory',
        items: [
          {
            label: 'Incoming',
            icon: Icon.STOCK_ITEM,
            routerLink: `${ApplicationUrl.STOCK}/${ApplicationUrl.STOCK_IN_LIST}`,
          },
          {
            label: 'Outgoing',
            icon: Icon.STOCK_ITEM,
            routerLink: `${ApplicationUrl.STOCK}/${ApplicationUrl.STOCK_OUT_LIST}`,
          },
          {
            label: 'Expired',
            icon: Icon.EXPIRED,
            routerLink: `${ApplicationUrl.EXPIRED}`,
          },
          {
            label: 'Adjustment',
            icon: Icon.TOOL,
            routerLink: `${ApplicationUrl.ADJUSTMENT}`,
          },
        ],
      },
      {
        label: 'Settings',
        items: [
          {
            label: 'Change Password',
            icon: Icon.TOOL,
            command: () => this.changePassword(),
          },
        ],
      },
      {
        label: 'Reports',
        items: [
          {
            label: 'Laboratory',
            icon: Icon.REPORT,
            routerLink: ApplicationUrl.LABORATORY_RESULT,
          },
        ],
      },
      {
        label: 'Sign Out',
        icon: Icon.LOGOUT,
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.confirmationService.confirm({
      ...this.commonHelper.commonConfrimation(),
      header: 'Session Confirmation',
      message: 'Are you sure you want to end your current session?',
      acceptLabel: 'Yes',
      accept: () => {
        this.spinner.show();
        setTimeout(() => {
          localStorage.clear();
          this.commonService.accessToken = localStorage.getItem(
            LocalKeys.accessToken
          );
          this.router.navigate(['security']);
          this.spinner.hide();
        }, 500);
      },
    });
  }

  changePassword() {
    this.dialogRef = this.dialogService.open(ChangePasswordComponent, {
      ...this.commonHelper.commonDialogOption(),
      header: 'Change Password',
    });

    this.dialogRef.onClose.subscribe((response) => {
      if (response && response.success) {
        localStorage.clear();
        this.commonService.accessToken = localStorage.getItem(
          LocalKeys.accessToken
        );
        this.router.navigate(['security']);
      }
    });
  }

  ngOnInit(): void {
    this.onLoadSideMenuItems();
  }
}
