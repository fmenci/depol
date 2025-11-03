import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-formula-math',
    templateUrl: './formula.math.component.html',
    styleUrls: ['./formula.math.component.less']
})
export class FormulaMathComponent {
    @Output() evpopbox = new EventEmitter<string>();
    constructor() { }
    popbox(ev: string) {
        this.evpopbox.emit(ev);
    }
}
