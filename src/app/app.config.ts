import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideAisuiteTstools } from 'aisuite-ngtools';
import { environment } from '../environments/environment';

// operational language setup, injected as globals by a <script> tag in index.html
declare const opLingua: string;
declare const aiSuiteLanguageJS: string | unknown[] | undefined;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withXhr()),
    provideAisuiteTstools({ opLingua, uiLanguageJS: aiSuiteLanguageJS, linsceApiUrl: environment.aisuiteApiUrl })
  ]
};
