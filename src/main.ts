import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Production mode is enabled automatically by `ng build` when optimization is on;
// calling enableProdMode() manually is discouraged as of Angular 22.
bootstrapApplication(AppComponent, appConfig)
  .catch((err: Error) => console.error(err));
