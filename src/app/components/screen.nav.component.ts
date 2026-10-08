import { LinScePipe } from '@aisuite-eu/ngtools';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LangSwitchComponent } from './lang.switch.component';
import { CorrosionLang } from '../../models/corrosion-view.model';

/** Sticky screen header: title, project reference field, print button and language switch. */
@Component({
    selector: 'app-screen-nav',
    templateUrl: './screen.nav.component.html',
    styleUrls: ['./screen.nav.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: 'navigation', class: 'ungest-print' },
    imports: [ReactiveFormsModule, LangSwitchComponent, LinScePipe]
})
export class ScreenNavComponent {
    lang = model.required<CorrosionLang>();
    refControl = input.required<FormControl>();
    printRequested = output<void>();
}
