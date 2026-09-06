import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AisuiteTstoolsModule } from 'aisuite-ngtools';

@Component({
    selector: 'app-formula-math',
    templateUrl: './formula.math.component.html',
    styleUrls: ['./formula.math.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AisuiteTstoolsModule]
})
export class FormulaMathComponent {
    @Output() evpopbox = new EventEmitter<string>();
    popbox(ev: string) {
        this.evpopbox.emit(ev);
    }
}
