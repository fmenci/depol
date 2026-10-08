import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CorrosionLang } from '../../models/corrosion-view.model';

@Component({
    selector: 'app-icorr-measure',
    templateUrl: './icorr.measure.component.html',
    styleUrls: ['./icorr.measure.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LinScePipe]
})
export class IcorrMeasureComponent {
    lang = input<CorrosionLang>('en');
}
