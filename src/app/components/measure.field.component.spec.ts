import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { MeasureFieldComponent } from './measure.field.component';

describe('MeasureFieldComponent', () => {
  function setup(sliders = true) {
    const fixture = TestBed.createComponent(MeasureFieldComponent);
    const control = new FormControl<number | null>(3);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('inputId', 'f');
    fixture.componentRef.setInput('ariaLabel', 'F');
    fixture.componentRef.setInput('unit', 'mA');
    fixture.componentRef.setInput('step', 0.1);
    fixture.componentRef.setInput('sliderMin', 0.1);
    fixture.componentRef.setInput('sliderMax', 30);
    fixture.componentRef.setInput('sliders', sliders);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    return { fixture, control, el };
  }
  const fire = (i: HTMLInputElement, v: string) => { i.value = v; i.dispatchEvent(new Event('input')); };

  it('keeps number, slider and control in sync in every direction', () => {
    const { fixture, control, el } = setup();
    const num = el.querySelector<HTMLInputElement>('input[type=number]')!;
    const rng = el.querySelector<HTMLInputElement>('input[type=range]')!;
    expect([num.value, rng.value]).toEqual(['3', '3']);

    fire(num, '12.5');
    fixture.detectChanges();
    expect(control.value).toBe(12.5);
    expect(rng.value).toBe('12.5');
    expect(num.value).toBe('12.5');

    fire(rng, '7.3');
    fixture.detectChanges();
    expect(control.value).toBe(7.3);
    expect(num.value).toBe('7.3');
    expect(rng.value).toBe('7.3');

    control.patchValue(20);
    fixture.detectChanges();
    expect([num.value, rng.value]).toEqual(['20', '20']);

    // number beyond the slider's range: control keeps it, slider clamps to its end
    fire(num, '55');
    expect(control.value).toBe(55);
    expect(num.value).toBe('55');
    expect(rng.value).toBe('30');

    // emptied number: control goes null, slider parks at its minimum, number stays empty
    fire(num, '');
    expect(control.value).toBeNull();
    expect(num.value).toBe('');
    expect(rng.value).toBe('0.1');
  });

  it('shows the current value on a slider that appears later, and tolerates having no slider', () => {
    const { fixture, control, el } = setup(false);
    const num = el.querySelector<HTMLInputElement>('input[type=number]')!;
    expect(el.querySelector('input[type=range]')).toBeNull();
    fire(num, '9'); // no slider to mirror into: must not throw
    expect(control.value).toBe(9);
    fixture.componentRef.setInput('sliders', true);
    fixture.detectChanges();
    const rng = el.querySelector<HTMLInputElement>('input[type=range]')!;
    expect(rng.value).toBe('9');
    fire(rng, '4');
    expect(num.value).toBe('4');
  });
});
