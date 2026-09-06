import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CorrosionPreventionCurveComponent } from './components/corrosionpreventioncurve.component';

@Component({
    selector: 'app-depol',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CorrosionPreventionCurveComponent]
})
export class AppComponent { }
