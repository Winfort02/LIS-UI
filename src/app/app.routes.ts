import { Routes } from '@angular/router';
import { CoreLayoutComponent } from './components/core/core-layout/core-layout.component';
import { LoginLayoutComponent } from './components/security/login-layout/login-layout.component';
import { loginGuardGuard } from './guards/login-guard.guard';
import { applicationGuardGuard } from './guards/application-guard.guard';
import { ApplicationUrl } from './enums/common.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ApplicationUrl.APPLICATION,
    pathMatch: 'full',
  },
  {
    path: ApplicationUrl.SECURITY,
    component: LoginLayoutComponent,
    canActivate: [loginGuardGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/security/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
    ],
  },
  {
    path: ApplicationUrl.APPLICATION,
    component: CoreLayoutComponent,
    canActivate: [applicationGuardGuard],
    children: [
      {
        path: ApplicationUrl.USERS,
        loadComponent: () =>
          import('./components/core/user/user.component').then(
            (c) => c.UserComponent
          ),
      },
      {
        path: ApplicationUrl.PATIENTS,
        loadComponent: () =>
          import('./components/core/patient/patient.component').then(
            (c) => c.PatientComponent
          ),
      },
      {
        path: 'patient/detail/:id',
        loadComponent: () =>
          import(
            './components/core/patient-detail/patient-detail.component'
          ).then((c) => c.PatientDetailComponent),
      },
      {
        path: ApplicationUrl.TEST,
        loadComponent: () =>
          import('./components/core/test/test.component').then(
            (c) => c.TestComponent
          ),
      },
      {
        path: ApplicationUrl.HEMATOLOGY,
        loadComponent: () =>
          import('./components/core/hematology/hematology.component').then(
            (c) => c.HematologyComponent
          ),
      },
      {
        path: `test/transaction/:transaction_no/${ApplicationUrl.HEMATOLOGY}`,
        loadComponent: () =>
          import(
            './components/shared/hematology-form/hematology-form.component'
          ).then((c) => c.HematologyFormComponent),
      },
      {
        path: `${ApplicationUrl.HEMATOLOGY_DETAIL}/:id`,
        loadComponent: () =>
          import(
            './components/core/hematology-detail/hematology-detail.component'
          ).then((c) => c.HematologyDetailComponent),
      },
      {
        path: `${ApplicationUrl.HEMATOLOGY}/pdf/:id`,
        loadComponent: () =>
          import('./components/shared/pdf-viewer/pdf-viewer.component').then(
            (c) => c.PdfViewerComponent
          ),
      },
      {
        path: ApplicationUrl.URINALYSIS,
        loadComponent: () =>
          import('./components/core/urinalysis/urinalysis.component').then(
            (c) => c.UrinalysisComponent
          ),
      },
      {
        path: `test/transaction/:transaction_no/${ApplicationUrl.URINALYSIS}`,
        loadComponent: () =>
          import(
            './components/shared/urinalysis-form/urinalysis-form.component'
          ).then((c) => c.UrinalysisFormComponent),
      },
      {
        path: `${ApplicationUrl.URINALYSIS}/detail/:id`,
        loadComponent: () =>
          import(
            './components/core/urinalysis-detail/urinalysis-detail.component'
          ).then((c) => c.UrinalysisDetailComponent),
      },
      {
        path: ApplicationUrl.CHEMSTRY,
        loadComponent: () =>
          import('./components/core/chemistry/chemistry.component').then(
            (c) => c.ChemistryComponent
          ),
      },
      {
        path: `test/transaction/:transaction_no/${ApplicationUrl.CHEMSTRY}`,
        loadComponent: () =>
          import(
            './components/shared/chemistry-form/chemistry-form.component'
          ).then((c) => c.ChemistryFormComponent),
      },
      {
        path: `${ApplicationUrl.CHEMSTRY}/detail/:id`,
        loadComponent: () =>
          import(
            './components/core/chemistry-detail/chemistry-detail.component'
          ).then((c) => c.ChemistryDetailComponent),
      },
      {
        path: ApplicationUrl.APPARATUS,
        loadComponent: () =>
          import('./components/core/apparatus/apparatus.component').then(
            (c) => c.ApparatusComponent
          ),
      },
      {
        path: ApplicationUrl.STOCK,
        loadComponent: () =>
          import('./components/core/stock/stock.component').then(
            (c) => c.StockComponent
          ),
      },
      {
        path: `${ApplicationUrl.STOCKS_ITEM}/:mode`,
        loadComponent: () =>
          import(
            './components/shared/stock-item-form/stock-item-form.component'
          ).then((c) => c.StockItemFormComponent),
      },
      {
        path: `${ApplicationUrl.STOCK}/${ApplicationUrl.STOCK_OUT_LIST}`,
        loadComponent: () =>
          import(
            './components/core/stock-out-list/stock-out-list.component'
          ).then((c) => c.StockOutListComponent),
      },
      {
        path: `${ApplicationUrl.STOCK}/${ApplicationUrl.STOCK_IN_LIST}`,
        loadComponent: () =>
          import(
            './components/core/stock-int-list/stock-int-list.component'
          ).then((c) => c.StockIntListComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'application',
    pathMatch: 'full',
  },
];
