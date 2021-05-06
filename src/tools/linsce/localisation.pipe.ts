
/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/

import { Pipe, PipeTransform } from '@angular/core';
import { LanguageRepository } from './language.repository';

// How to use :
//    {{ '<tag name>' | localise: formula }}
@Pipe({ name: 'localise' })
export class LocalisePipe implements PipeTransform {
  constructor(private repo: LanguageRepository) { }
  transform(tag: string, formula: string): string {
    return this.repo.label(formula, tag);
  }
}
