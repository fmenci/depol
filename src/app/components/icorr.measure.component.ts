import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-icorr-measure',
    templateUrl: './icorr.measure.component.html',
    styleUrls: ['./icorr.measure.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LinScePipe]
})
export class IcorrMeasureComponent {
}
