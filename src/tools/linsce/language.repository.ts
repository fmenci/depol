import { Injectable } from '@angular/core';
import { LanguageFormula } from '../models/languageformula.model';
import { LanguageTag } from '../models/languagetag.model';

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
    private currentlingua: string;

    constructor() {
        this.currentlingua = opLingua;
        this.initFormula();
    }

    public label(formula: string, tag: string): string {
        const myformula = this.linformula.find(tm => tm.formula === formula && tm.lingua === this.currentlingua);
        if (myformula !== undefined) {
            const ltag = myformula.tags.find(tm => tm.tag === tag);
            if (ltag !== undefined) {
                return ltag.pcmt;
            }
        }
        return '*' + tag;
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
