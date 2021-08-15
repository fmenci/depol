import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DEFLIN } from '../constantes.helper';
import { TimeDelayDirective } from '../timedelay.directive';
import { LanguageFormula } from './models/languageformula.model';
import { LanguageTag } from './models/languagetag.model';
import { LinguaQueryModel } from './models/linguaquery.model';

declare const opLingua: string;
declare const aiSuiteLanguageJS: string | any[] | undefined;

/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/
@Injectable()
export class LanguageRepository {
  private linformula: LanguageFormula[] = [];
  private calltagurl = 'api/WorldDesk/AjaxCallTag';
  private currentlingua: string;
  private tagStatus: LinguaQueryModel[] = [];
  private delaychecktags: TimeDelayDirective = new TimeDelayDirective(3000);

  constructor(
    private http: HttpClient
  ) {
    this.calltagurl = environment.baseUrl + this.calltagurl;
    if (opLingua === undefined) {
      this.currentlingua = DEFLIN; // Default
    } else {
      this.currentlingua = opLingua;
    }
    if (!this.currentlingua || this.currentlingua.length < 2) {
      console.log('forcing op lingua to (default) ' + DEFLIN);
      this.currentlingua = DEFLIN;
    }
    this.delaychecktags.event.subscribe(() => {
      if (this.tagStatus.length > 0) {
        this.http.post(this.calltagurl, this.tagStatus).subscribe();
        this.tagStatus = [];
      }
    });
    this.initFormula();
  }

  public label(formula: string, tag: string): string {
    const myformula = this.linformula.find((tm: LanguageFormula) => tm.formula === formula);
    if (myformula !== undefined) {
      const ltag = myformula.tags.find((tm: LanguageTag) => tm.tag === tag);
      if (ltag === undefined) {
        // then add to cache
        myformula.tags.push(new LanguageTag(tag, '*' + tag, 1));
      } else {
        if (ltag.use === undefined) {
          ltag.use = 0;
        }
        if (ltag.use === 0) {
          this.tagStatus.push(new LinguaQueryModel(formula, tag, this.currentlingua));
          this.delaychecktags.tima();
        }
        ltag.use++;
        return ltag.pcmt;
      }
    }
    console.log('missing tag ' + formula + ' - ' + tag + ' ' + this.currentlingua);
    const foundtag = this.tagStatus.find((tm: LinguaQueryModel) => tm.formula === formula && tm.tag === tag);
    if (foundtag === undefined) {
      this.tagStatus.push(new LinguaQueryModel(formula, tag, this.currentlingua, true));
      this.delaychecktags.tima();
    }
    // add missing formula to cache
    this.linformula.push(new LanguageFormula(formula, this.currentlingua, [new LanguageTag(tag, '*' + tag, 1)]));
    return '*' + tag;
  }

  get operationLingua(): string {
    return opLingua;
  }

  private initFormula(): void {
    if (aiSuiteLanguageJS !== undefined) {
      let formcount = aiSuiteLanguageJS.length;
      while (formcount > 0) {
        formcount--;
        const exportformula = aiSuiteLanguageJS[formcount];
        const lformula = new LanguageFormula(exportformula.formula, exportformula.lingua, []);
        const exporttags = exportformula.tags;
        let tagcount = exporttags.length;
        while (tagcount > 0) {
          tagcount--;
          const exporttag = exporttags[tagcount];
          const ntag = new LanguageTag(exporttag.tag, exporttag.pcmt);
          lformula.tags.push(ntag);
        }
        this.linformula.push(lformula);
      }
    }
  }
}
