import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AisuiteTstoolsModule } from 'aisuite-ngtools';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { CorrosionPreventionCurveComponent } from './components/corrosionpreventioncurve.component';
import { FormulaMathComponent } from './components/formula.math.component';
import { TheeCanvasComponent } from './components/theecanvas';
import { provideHttpClient } from '@angular/common/http';

declare const opLingua: string;
declare const aiSuiteLanguageJS: string | any[] | undefined;

@NgModule({
  declarations: [
    AppComponent, TheeCanvasComponent, CorrosionPreventionCurveComponent, FormulaMathComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    AisuiteTstoolsModule.forRoot({ opLingua, uiLanguageJS: aiSuiteLanguageJS, baseUrl: environment.baseUrl })
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
