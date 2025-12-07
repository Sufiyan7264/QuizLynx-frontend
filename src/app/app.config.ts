import {  ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CredInterceptor } from './core/interceptor/credInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    { provide: MessageService, useClass: MessageService },
    provideHttpClient(withInterceptors([CredInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG(
      {
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: '.light',
              cssLayer:{
                order: 'theme, base,  utilities,primeng',
                name:'primeng'
              }
          }
        }
    })
    
  ]
};
