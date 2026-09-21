import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

/** FR/EN segmented control: one visually hidden radio per language, its label is the button. */
@Component({
    selector: 'app-lang-switch',
    templateUrl: './lang.switch.component.html',
    styleUrls: ['./lang.switch.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LangSwitchComponent {
    lang = model.required<CorrosionLang>();

    protected readonly options = (Object.keys(CORROSION_STRINGS) as CorrosionLang[])
        .map((code) => ({ code, label: CORROSION_STRINGS[code].lang }));
}
