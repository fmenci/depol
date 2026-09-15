import { ChangeDetectionStrategy, Component, SecurityContext, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';
import { LanguageService } from 'aisuite-ngtools';
import { FormulaMathComponent } from './formula.math.component';
import { TheeCanvasComponent } from './theecanvas';
import { RedoxCalculation } from '../../models/redox.calculation.model';
import { IcorrResultModel } from '../../models/icorr.result.model';
import { environment } from '../../environments/environment';
import { formatMagnitude } from '../../models/chart-geometry.model';
import { CORROSION_STRINGS, CorrosionLang, VERDICT_THEME, VerdictKey, verdictKeyFor } from '../../models/corrosion-strings.model';

@Component({
    selector: 'app-corrosion-prevention-curve',
    templateUrl: './corrosionpreventioncurve.component.html',
    styleUrls: ['./corrosionpreventioncurve.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, JsonPipe, FormulaMathComponent, TheeCanvasComponent]
})
export class CorrosionPreventionCurveComponent {
    private readonly linrepo = inject(LanguageService);
    private readonly sanitizer = inject(DomSanitizer);

    // The screen's own FR/EN toggle is local state (see corrosion-strings.model.ts for why),
    // seeded from the app's configured language so the initial paint matches the rest of the app.
    protected readonly lang = signal<CorrosionLang>(this.linrepo.operationLingua === 'fr' ? 'fr' : 'en');
    // Sliders start collapsed on small/short viewports so the number fields aren't pushed
    // out of view; this is a one-off read of the initial viewport, not a persistent listener.
    protected readonly slidersOn = signal(
        typeof window === 'undefined' || (window.innerWidth >= 720 && window.innerHeight >= 640)
    );

    corrosionview: RedoxCalculation = new RedoxCalculation(740, 618, 3, 1, '');
    // No explicit FormGroup<...> annotation: inference keeps each control's concrete FormControl
    // type, which the range-input [formControl] bindings in the template need (they share the
    // same control instance as the paired formControlName number input).
    aiForm = new FormGroup({
        xon: new FormControl(this.corrosionview.xon),
        xoff: new FormControl(this.corrosionview.xoff),
        measuredIntensity: new FormControl(this.corrosionview.measuredIntensity),
        measuredSurface: new FormControl(this.corrosionview.measuredSurface),
        refReport: new FormControl()
    });

    protected readonly t = () => CORROSION_STRINGS[this.lang()];

    constructor() {
        // Rebuild the curve as a new instance (rather than mutating in place) so OnPush children
        // bound to it (app-theecanvas) pick up the change.
        this.aiForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.syncCorrosionView());
    }

    get showingdebug(): boolean {
        return !environment.production;
    }

    get icorrResult(): IcorrResultModel {
        return this.corrosionview.icorr();
    }

    get verdictKey(): VerdictKey {
        return verdictKeyFor(this.icorrResult.effect);
    }

    get verdictLabel(): string {
        return this.t().verdict[this.verdictKey];
    }

    get verdictTheme(): { ink: string; tint: string } {
        return VERDICT_THEME[this.verdictKey];
    }

    get icorrText(): string {
        return this.formOk ? formatMagnitude(this.icorrResult.result) : '—';
    }

    get deltaE(): number {
        return Math.abs(this.corrosionview.xon - this.corrosionview.xoff);
    }

    get density(): number {
        return this.corrosionview.measuredSurface > 0 ? this.corrosionview.measuredIntensity / this.corrosionview.measuredSurface : 0;
    }

    get densityText(): string {
        return this.density > 0 ? formatMagnitude(this.density) : '—';
    }

    get formOk(): boolean {
        const v = this.corrosionview;
        return v.xon > 0 && v.xoff > 0 && v.measuredIntensity > 0 && v.measuredSurface > 0;
    }

    /** Validation hint (design handoff README §"Rail card 1 — Measurement"), in the current language. */
    get hint(): string | null {
        const v = this.corrosionview;
        if (!(v.xon > 0) || !(v.xoff > 0) || !(v.measuredIntensity > 0) || !(v.measuredSurface > 0)) {
            return this.t().hintZero;
        }
        if (v.xon <= v.xoff) {
            return this.t().hintXon;
        }
        return null;
    }

    get sliderBtnLabel(): string {
        return (this.slidersOn() ? '− ' : '+ ') + this.t().sliders;
    }

    get refreport(): string {
        const ctr = this.aiForm.get('refReport') as FormControl;
        return ctr.value;
    }

    get refreportPrint(): string {
        return this.refreport || '—';
    }

    get printDate(): string {
        return new Date().toLocaleDateString(this.lang() === 'fr' ? 'fr-FR' : 'en-GB');
    }

    get headPrintTemplate(): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, this.linrepo.docHeaderTemplate) ?? '';
    }

    setLang(lang: CorrosionLang): void {
        this.lang.set(lang);
    }

    toggleSliders(): void {
        this.slidersOn.update((v) => !v);
    }

    onDragMove(move: { xoff: number; iapp: number }): void {
        this.aiForm.patchValue({ xoff: move.xoff, measuredIntensity: move.iapp });
    }

    onSubmit(): void {
        // Reactive form only backs the fields; there's nothing to submit server-side on this screen.
    }

    mePrint(): void {
        window.print();
    }

    private syncCorrosionView(): void {
        const v = this.aiForm.value;
        this.corrosionview = new RedoxCalculation(
            v.xon ?? 0, v.xoff ?? 0, v.measuredIntensity ?? 0, v.measuredSurface ?? 0, this.corrosionview.linecolor
        );
    }
}
