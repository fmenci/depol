import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LanguageRepository } from './language.repository';
import { LocalisePipe } from './localisation.pipe';

@NgModule({
  declarations: [LocalisePipe],
  imports: [HttpClientModule, CommonModule],
  providers: [LanguageRepository],
  exports: [LocalisePipe]
})
/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/
export class LinsceModule { }
