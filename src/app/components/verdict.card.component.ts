import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Rail card 2 — the verdict tag, i corr and the two figures it was derived from. */
@Component({
    selector: 'app-verdict-card',
    templateUrl: './verdict.card.component.html',
    styleUrls: ['./verdict.card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LinScePipe],
    host: { class: 'blueprint' }
})
export class VerdictCardComponent {
    verdictLabel = input.required<string>();
    icorrText = input.required<string>();
    deltaE = input.required<number>();
    densityText = input.required<string>();
}
