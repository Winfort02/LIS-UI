import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { APP_PROVIDER } from './app.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNoopAnimations(),
    APP_PROVIDER,
  ],
};
