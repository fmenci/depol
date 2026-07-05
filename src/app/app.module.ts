import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AisuiteTstoolsModule } from 'aisuite-ngtools';
import { AppComponent } from './app.component';
import { CorrosionPreventionCurveComponent } from './components/corrosionpreventioncurve.component';
import { FormulaMathComponent } from './components/formula.math.component';
import { TheeCanvasComponent } from './components/theecanvas';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { environment } from '../environments/environment';

declare const opLingua: string;
declare const aiSuiteLanguageJS: string | any[] | undefined;

@NgModule({
  declarations: [
    AppComponent, TheeCanvasComponent, CorrosionPreventionCurveComponent, FormulaMathComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    AisuiteTstoolsModule.forRoot({ opLingua, uiLanguageJS: aiSuiteLanguageJS, linsceApiUrl: environment.aisuiteApiUrl })
  ],
  providers: [provideHttpClient(withXhr())],
  bootstrap: [AppComponent]
})
export class AppModule { }
