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
})
export class SidebarComponent implements OnInit {
  @Input() active!: boolean;
  position: string = '';
  activeSubmenus: { [key: string]: boolean } = {};
  sideItems: MenuItem[] = [];
  scrollable = true;
  commonHelper = new CommonHelper<User>();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
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
        routerLink: '',
      },
      {
        label: 'Users',
        icon: Icon.FOLDER,
        routerLink: ApplicationUrl.USERS,
      },
      {
        label: 'Patients',
        icon: Icon.FOLDER,
        routerLink: ApplicationUrl.PATIENTS,
      },
      {
        label: 'Hematology',
        icon: Icon.FOLDER,
        routerLink: ApplicationUrl.HEMATOLOGY,
      },
      {
        label: 'Urinalysis',
        icon: Icon.FOLDER,
        routerLink: ApplicationUrl.URINALYSIS,
      },
      {
        label: 'Reports',
        icon: Icon.FOLDER,
        routerLink: '',
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

  ngOnInit(): void {
    this.onLoadSideMenuItems();
  }
}
