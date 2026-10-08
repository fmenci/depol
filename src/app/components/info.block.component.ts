import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormulaMathComponent } from './formula.math.component';
import { IcorrMeasureComponent } from './icorr.measure.component';
import { CorrosionLang } from '../../models/corrosion-view.model';

/** Under the chart: the measurement schematic, the depolarisation formula and what each input means. */
@Component({
    selector: 'app-info-block',
    templateUrl: './info.block.component.html',
    styleUrls: ['./info.block.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormulaMathComponent, IcorrMeasureComponent, LinScePipe]
})
export class InfoBlockComponent {
    lang = input<CorrosionLang>('en');
}
