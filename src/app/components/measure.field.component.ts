import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * One measurement: caption (projected) + unit, the precise number input and, while `sliders` is on,
 * a coarse range input. Both inputs are bound to the same control, so a programmatic change (the
 * chart's drag) reaches both. A change typed or dragged in one input is written to the control by
 * its own accessor, which doesn't echo it back to the control's other bound element — so each input
 * mirrors itself into the other one.
 */
@Component({
    selector: 'app-measure-field',
    templateUrl: './measure.field.component.html',
    styleUrls: ['./measure.field.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class MeasureFieldComponent {
    control = input.required<FormControl<number | null>>();
    inputId = input.required<string>();
    ariaLabel = input.required<string>();
    unit = input.required<string>();
    step = input(1);
    sliderMin = input(0);
    sliderMax = input.required<number>();
    sliders = input(false);

    private readonly numberInput = viewChild.required<ElementRef<HTMLInputElement>>('number');
    private readonly rangeInput = viewChild<ElementRef<HTMLInputElement>>('range');

    protected mirrorToRange(): void {
        const range = this.rangeInput()?.nativeElement;
        if (range) {
            // An emptied number field parks the slider at its minimum (a blank range value would
            // put it mid-track).
            range.value = this.numberInput().nativeElement.value || String(this.sliderMin());
        }
    }

    protected mirrorToNumber(): void {
        const range = this.rangeInput()?.nativeElement;
        if (range) {
            this.numberInput().nativeElement.value = range.value;
        }
    }
}
