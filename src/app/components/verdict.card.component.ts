import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

/** Rail card 2 — the verdict tag, i corr and the two figures it was derived from. */
@Component({
    selector: 'app-verdict-card',
    templateUrl: './verdict.card.component.html',
    styleUrls: ['./verdict.card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'blueprint' }
})
export class VerdictCardComponent {
    lang = input<CorrosionLang>('en');
    verdictLabel = input.required<string>();
    icorrText = input.required<string>();
    deltaE = input.required<number>();
    densityText = input.required<string>();

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
