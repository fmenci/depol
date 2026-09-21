import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LangSwitchComponent } from './lang.switch.component';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

/** Sticky screen header: title, project reference field, print button and language switch. */
@Component({
    selector: 'app-screen-nav',
    templateUrl: './screen.nav.component.html',
    styleUrls: ['./screen.nav.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: 'navigation', class: 'ungest-print' },
    imports: [ReactiveFormsModule, LangSwitchComponent]
})
export class ScreenNavComponent {
    lang = model.required<CorrosionLang>();
    refControl = input.required<FormControl>();
    printRequested = output<void>();

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
