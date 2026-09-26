import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

export interface LegendChip {
    density: number;
    label: string;
    color: string;
    dash: string;
    width: number;
    on: boolean;
}

/**
 * Key to the chart's reference curves, with per-curve and all-curves toggles. It doesn't own the
 * visibility state — the chart draws the curves — so it only reports the toggles it's asked for.
 * `plate` is the compact form that sits inside the plot (two chip columns, no drag hint); the
 * chart positions the box around it.
 */
@Component({
    selector: 'app-chart-legend',
    templateUrl: './chart.legend.component.html',
    styleUrls: ['./chart.legend.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class.plate]': 'plate()' }
})
export class ChartLegendComponent {
    chips = input.required<LegendChip[]>();
    refsOn = input.required<boolean>();
    verdictInk = input.required<string>();
    lang = input<CorrosionLang>('en');
    plate = input(false);

    refsToggled = output<void>();
    curveToggled = output<number>();

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
