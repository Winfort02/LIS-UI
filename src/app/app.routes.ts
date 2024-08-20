import { Routes } from '@angular/router';
import { CoreLayoutComponent } from './components/core/core-layout/core-layout.component';
import { LoginLayoutComponent } from './components/security/login-layout/login-layout.component';
import { loginGuardGuard } from './guards/login-guard.guard';
import { applicationGuardGuard } from './guards/application-guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'application',
    pathMatch: 'full',
  },
  {
    path: 'security',
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
    path: 'application',
    component: CoreLayoutComponent,
    canActivate: [applicationGuardGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./components/core/user/user.component').then(
            (c) => c.UserComponent
          ),
      },
      {
        path: 'patients',
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
    ],
  },
  {
    path: '**',
    redirectTo: 'application',
    pathMatch: 'full',
  },
];
