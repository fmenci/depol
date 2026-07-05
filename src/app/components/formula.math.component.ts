import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-formula-math',
    templateUrl: './formula.math.component.html',
    styleUrls: ['./formula.math.component.less'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FormulaMathComponent {
    @Output() evpopbox = new EventEmitter<string>();
    constructor() { }
    popbox(ev: string) {
        this.evpopbox.emit(ev);
    }
}
