import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CorrosionPreventionCurveComponent } from './components/corrosionpreventioncurve.component';
import { FormulaMathComponent } from './components/formula.math.component';
import { TheeCanvasComponent } from './components/theecanvas';

@NgModule({
  declarations: [
    AppComponent, TheeCanvasComponent, CorrosionPreventionCurveComponent, FormulaMathComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
