import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IAjaxResponse } from '../models/iajax.response';
import { ALLLIN } from '../constantes.helper';
import { ILinguaFlag } from './models/ilingua.flag';
import { environment } from '../../environments/environment';

@Injectable()
export class FlagsRepository {

  public default: ILinguaFlag = {
    name: ALLLIN,
    altName: 'All languages',
    imageUrl: 'images/flags/Flag_00.svg',
    label: 'All',
    check: false
  };
  public linguas: ILinguaFlag[] = [];
  public lintrim00: ILinguaFlag[] = [];

  private urllingua = 'api/WorldDesk/Linguas';

  constructor(
    private http: HttpClient
  ) {
    this.http.get<IAjaxResponse<ILinguaFlag>>(environment.baseUrl + this.urllingua)
      .subscribe((result: IAjaxResponse<ILinguaFlag>) => {
        if (result.success && result.valid) {
          this.linguas = result.data;
          result.data.forEach(tm => {
            if (tm.name === ALLLIN) {
              // Remove Lingua '00'
            } else {
              this.lintrim00.push(tm);
            }
          });
        } else {
          this.linguas = [];
        }
      }, (error: any) => console.error(error));
  }

  public getFlag(lin: string): ILinguaFlag {
    return this.linguas.find(l => l.name === lin) ?? this.default;
  }

}
