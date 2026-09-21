import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormulaMathComponent } from './formula.math.component';
import { IcorrMeasureComponent } from './icorr.measure.component';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

/** Under the chart: the measurement schematic, the depolarisation formula and what each input means. */
@Component({
    selector: 'app-info-block',
    templateUrl: './info.block.component.html',
    styleUrls: ['./info.block.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormulaMathComponent, IcorrMeasureComponent]
})
export class InfoBlockComponent {
    lang = input<CorrosionLang>('en');

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
