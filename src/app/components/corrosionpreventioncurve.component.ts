import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IcorrResultModel } from 'src/models/icorr.result.model';
import { RedoxCalculation } from 'src/models/redox.calculation.model';
import { LanguageRepository } from 'src/tools/linsce/language.repository';
import { TimeDelayDirective } from 'src/tools/timedelay.directive';
import { FormulaMathComponent } from './formula.math.component';

@Component({
  selector: 'app-corrosion-prevention-curve',
  templateUrl: './corrosionpreventioncurve.component.html'
})
export class CorrosionPreventionCurveComponent implements AfterViewInit {
  @ViewChild('mathformula') private mathformula!: FormulaMathComponent;
  corrosionview: RedoxCalculation = new RedoxCalculation(740, 618, 3, 1, '#d40707');
  aiForm = this.fb.group({
    xon: [this.corrosionview.xon],
    xoff: [this.corrosionview.xoff],
    measuredIntensity: [this.corrosionview.measuredIntensity],
    measuredSurface: [this.corrosionview.measuredSurface],
    refreport: ['']
  });
  private ispoped = false;
  private delay: TimeDelayDirective<string> = new TimeDelayDirective<string>();

  constructor(private fb: FormBuilder, private linrepo: LanguageRepository) {
    this.delay.event.subscribe((ev: string) => {
      console.log(ev);
      this.ispoped = ev !== '';
    });
  }

  ngAfterViewInit(): void {
    if (this.mathformula !== undefined) {
      this.mathformula.evpopbox.subscribe((ev: string) => {
        this.delay.tima(ev);
      });
    }
  }

  onSubmit() {
    //console.log(this.aiForm.value);
  }

  popbox(ev: string) {
    this.delay.tima(ev);
  }

  mePrint() {
    window.print();
  }

  get showingdebug(): boolean {
    return !environment.production;
  }

  get corrosionmodel(): RedoxCalculation {
    const ctrxon = this.aiForm.get('xon') as FormControl;
    this.corrosionview.xon = ctrxon.value;
    const ctrxoff = this.aiForm.get('xoff') as FormControl;
    this.corrosionview.xoff = ctrxoff.value;
    const ctrmeasuredIntensity = this.aiForm.get('measuredIntensity') as FormControl;
    this.corrosionview.measuredIntensity = ctrmeasuredIntensity.value;
    const ctrmeasuredSurface = this.aiForm.get('measuredSurface') as FormControl;
    this.corrosionview.measuredSurface = ctrmeasuredSurface.value;
    return this.corrosionview;
  }

  get userIcorr(): IcorrResultModel {
    const uIcorr = this.corrosionmodel.icorr();
    switch (uIcorr.effect) {
      case 'high':
        uIcorr.effect = this.linrepo.label('RGD', 'icorrDepolHigh');
        break;
      case 'moderate':
        uIcorr.effect = this.linrepo.label('RGD', 'icorrDepolModerate');
        break;
      case 'low':
        uIcorr.effect = this.linrepo.label('RGD', 'icorrDepolLow');
        break;
      case 'passive':
        uIcorr.effect = this.linrepo.label('RGD', 'icorrDepolPassif');
        break;
      default:
        uIcorr.effect = this.linrepo.label('RGD', 'icorrDepolUnset');
        break;
    }
    return uIcorr;
  }

  get illustdisplay() {
    if (this.ispoped === true) {
      return 'block';
    }
    return 'none';
  }
}
