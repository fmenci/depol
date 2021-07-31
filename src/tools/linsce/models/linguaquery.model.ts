
/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/

export class LinguaQueryModel {
  constructor(
    public formula: string,
    public tag: string,
    public lingua: string,
    public search: boolean = false
  ) { }
}
