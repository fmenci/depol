import { AfterViewInit, ChangeDetectionStrategy, Component, SecurityContext, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';
import { AisuiteTstoolsModule, LanguageService, TimeDelayDirective } from 'aisuite-ngtools';
import { FormulaMathComponent } from './formula.math.component';
import { TheeCanvasComponent } from './theecanvas';
import { RedoxCalculation } from '../../models/redox.calculation.model';
import { environment } from '../../environments/environment';
import { IcorrResultModel } from '../../models/icorr.result.model';

@Component({
    selector: 'app-corrosion-prevention-curve',
    templateUrl: './corrosionpreventioncurve.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, AisuiteTstoolsModule, JsonPipe, FormulaMathComponent, TheeCanvasComponent]
})
export class CorrosionPreventionCurveComponent implements AfterViewInit {
  @ViewChild('mathformula') private mathformula!: FormulaMathComponent;

  private readonly linrepo = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);

  corrosionview: RedoxCalculation = new RedoxCalculation(740, 618, 3, 1, '#d40707');
  aiForm: FormGroup = new FormGroup({
    xon: new FormControl(this.corrosionview.xon),
    xoff: new FormControl(this.corrosionview.xoff),
    measuredIntensity: new FormControl(this.corrosionview.measuredIntensity),
    measuredSurface: new FormControl(this.corrosionview.measuredSurface),
    refReport: new FormControl()
  });
  private ispoped = false;
  private delay: TimeDelayDirective<string> = new TimeDelayDirective<string>();

  constructor() {
    this.delay.event.subscribe((ev: string) => {
      this.ispoped = ev !== '';
    });
    // rebuild the curve as a new instance (rather than mutating in place) so
    // OnPush children bound to it (e.g. app-theecanvas) pick up the change.
    this.aiForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncCorrosionView());
  }

  get showingdebug(): boolean {
    return !environment.production;
  }

  get userIcorr(): IcorrResultModel {
    const uIcorr = this.corrosionview.icorr();
    switch (uIcorr.effect) {
      case 'high':
        uIcorr.effect = this.linrepo.label('Predim', 'icorrDepolHigh');
        break;
      case 'moderate':
        uIcorr.effect = this.linrepo.label('Predim', 'icorrDepolModerate');
        break;
      case 'low':
        uIcorr.effect = this.linrepo.label('Predim', 'icorrDepolLow');
        break;
      case 'passive':
        uIcorr.effect = this.linrepo.label('Predim', 'icorrDepolPassif');
        break;
      default:
        uIcorr.effect = this.linrepo.label('Predim', 'icorrDepolUnset');
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

  get refreport(): string {
    const ctr = this.aiForm.get('refReport') as FormControl;
    return ctr.value;
  }

  get headPrintTemplate(): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.linrepo.docHeaderTemplate) ?? '';
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

  goToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  private syncCorrosionView(): void {
    const v = this.aiForm.value;
    this.corrosionview = new RedoxCalculation(
      v.xon, v.xoff, v.measuredIntensity, v.measuredSurface, this.corrosionview.linecolor
    );
  }
}
