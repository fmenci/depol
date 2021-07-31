
/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/

import { LanguageTag } from './languagetag.model';

export class LanguageFormula {
  constructor(
    public formula: string,
    public lingua: string,
    public tags: LanguageTag[]
  ) { }
}
