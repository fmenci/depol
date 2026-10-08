import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideAisuiteNgtools } from '@aisuite-eu/ngtools';
import { environment } from '../environments/environment';
import { linguaExport } from '../models/corrosion-view.model';

// operational language setup, injected as globals by a <script> tag in index.html (labels: aiSuiteLanguageJS, see linguaExport)
declare const opLingua: string;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withXhr()),
    provideAisuiteNgtools({ opLingua, uiLanguageJS: linguaExport(opLingua), linsceApiUrl: environment.aisuiteApiUrl })
  ]
};
