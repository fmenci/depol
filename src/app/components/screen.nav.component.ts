import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/** Sticky screen header: title, project reference field, print button and language switch. */
@Component({
    selector: 'app-screen-nav',
    templateUrl: './screen.nav.component.html',
    styleUrls: ['./screen.nav.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: 'navigation', class: 'ungest-print' },
    imports: [ReactiveFormsModule, LinScePipe]
})
export class ScreenNavComponent {
    refControl = input.required<FormControl>();
    printRequested = output<void>();
}
