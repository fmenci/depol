import { LanguageService, LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MeasureFieldComponent } from './measure.field.component';
import { CorrosionLang, PREDIM } from '../../models/corrosion-view.model';

export interface MeasurementControls {
    measuredIntensity: FormControl<number | null>;
    measuredSurface: FormControl<number | null>;
    xon: FormControl<number | null>;
    xoff: FormControl<number | null>;
}

/** Rail card 1 — the four measured values, each with a number input and an optional coarse slider. */
@Component({
    selector: 'app-measurement-card',
    templateUrl: './measurement.card.component.html',
    styleUrls: ['./measurement.card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'blueprint' },
    imports: [MeasureFieldComponent, LinScePipe]
})
export class MeasurementCardComponent {
    private readonly linrepo = inject(LanguageService);
    controls = input.required<MeasurementControls>();
    lang = input<CorrosionLang>('en');
    /** Validation message, already in the current language; null when the measurements are usable. */
    hint = input<string | null>(null);

    // Sliders start collapsed on small/short viewports so the number fields aren't pushed
    // out of view; this is a one-off read of the initial viewport, not a persistent listener.
    protected readonly slidersOn = signal(
        typeof window === 'undefined' || (window.innerWidth >= 720 && window.innerHeight >= 640)
    );

    protected readonly sliderBtnLabel = computed(() => {
        this.lang();
        return (this.slidersOn() ? '− ' : '+ ') + this.linrepo.label(PREDIM, 'sliders');
    });

    protected toggleSliders(): void {
        this.slidersOn.update((v) => !v);
    }
}
