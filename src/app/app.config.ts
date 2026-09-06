import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { AisuiteTstoolsModule } from 'aisuite-ngtools';
import { environment } from '../environments/environment';

// operational language setup, injected as globals by a <script> tag in index.html
declare const opLingua: string;
declare const aiSuiteLanguageJS: string | unknown[] | undefined;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withXhr()),
    importProvidersFrom(
      AisuiteTstoolsModule.forRoot({ opLingua, uiLanguageJS: aiSuiteLanguageJS, linsceApiUrl: environment.aisuiteApiUrl })
    )
  ]
};
