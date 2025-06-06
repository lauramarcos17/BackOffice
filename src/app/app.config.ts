import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './shared/services/AuthInterceptor';
import { routes } from './app.routes';
import { provideHttpClient, withFetch,withInterceptors  } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(withFetch(),withInterceptors([AuthInterceptor]))

  ]
};
