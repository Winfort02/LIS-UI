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
        path: ApplicationUrl.HEMATOLOGY,
        loadComponent: () =>
          import('./components/core/hematology/hematology.component').then(
            (c) => c.HematologyComponent
          ),
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
    ],
  },
  {
    path: '**',
    redirectTo: 'application',
    pathMatch: 'full',
  },
];
