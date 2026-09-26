import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RedoxCalculation } from '../../models/redox.calculation.model';
import { CORROSION_STRINGS, CorrosionLang } from '../../models/corrosion-strings.model';

/**
 * Report header and measurement table, on the printed page only. The host carries the app-wide
 * .gest-print convention (src/styles.less): hidden on screen, shown by the browser's @media print.
 */
@Component({
    selector: 'app-print-sheet',
    templateUrl: './print.sheet.component.html',
    styleUrls: ['./print.sheet.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'gest-print' }
})
export class PrintSheetComponent {
    lang = input<CorrosionLang>('en');
    /** The measurements the report is about. */
    view = input.required<RedoxCalculation>();
    /** Sanitized HTML of the document header (logo, address…) configured on the language service. */
    headHtml = input('');
    reference = input.required<string>();
    date = input.required<string>();
    verdictLabel = input.required<string>();
    icorrText = input.required<string>();
    deltaE = input.required<number>();
    densityText = input.required<string>();

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
}
