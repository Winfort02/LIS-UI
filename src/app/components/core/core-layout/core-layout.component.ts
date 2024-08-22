import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-core-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ToolbarComponent,
    RouterOutlet,
    BreadcrumbModule,
  ],
  templateUrl: './core-layout.component.html',
  styleUrl: './core-layout.component.scss',
})
export class CoreLayoutComponent implements OnInit {
  menuActive!: boolean;

  items: MenuItem[] = [];
  home!: MenuItem;

  constructor(private router: Router) {
    this.router.events.subscribe(() => this.getAllItemsBreaCrumb());
  }

  onMaskClick() {
    this.hideMenu();
  }

  onMenuButtonClick() {
    this.menuActive = true;
    this.addClass(document.body, 'blocked-scroll');
  }

  hideMenu() {
    this.menuActive = false;
    this.removeClass(document.body, 'blocked-scroll');
  }

  removeClass(element: any, className: string) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
  }

  addClass(element: any, className: string) {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
  }

  getAllItemsBreaCrumb() {
    this.home = [];
    this.items = [];
    let str = this.router.url.split('/');
    str.shift();
    if (str.length > 0) {
      for (let i = 0; i < str.length; i++) {
        if (str[i].search('-') < 0) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        } else {
          if (str[i].split('-').join(' ').split(' ').length > 0) {
            let words = str[i].split('-').join(' ').split(' ');
            str[i] = '';
            for (let x = 0; x < words.length; x++) {
              str[i] +=
                words[x].charAt(0).toUpperCase() + words[x].substring(1) + ' ';
            }
          }
        }

        this.items.push({
          label: str[i].length > 30 ? str[i].substring(0, 20) + '...' : str[i],
        });
      }
      this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
  }

  ngOnInit(): void {}
}
