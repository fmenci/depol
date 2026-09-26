import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

@Component({
    selector: 'app-icorr-measure',
    templateUrl: './icorr.measure.component.html',
    styleUrls: ['./icorr.measure.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IcorrMeasureComponent {
    lang = input<CorrosionLang>('en');

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
