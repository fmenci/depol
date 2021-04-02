
/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied everywhere else it is needed thus enabling a single point for development.
*/

import { Directive, EventEmitter, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { UI_DELAY } from './constantes.helper';

/**
 * T = Type générique (optionnel) de l'EventEmitter
 *
 * Déclarer TimeDelayDirective dans une classe :
 * private delay: TimeDelayDirective<T> = new TimeDelayDirective<T>(delayInMsDefaultingTo250); ('T' optionnel)
 *
 * Appeler doWhatever à la fin du délai :
 * constructor(...) {
 *    delay.event.subscribe((obj: T) => this.doWhatever(obj)); ('obj' optionnel)
 * }
 *
 * Démarrer le délai :
 * this.delay.tima(obj); ('obj' optionnel)
 * */
@Directive()
export class TimeDelayDirective<T = undefined> {

  @Output() event: EventEmitter<T> = new EventEmitter<T>();
  private triggerSubscribe: Subscription | undefined;

  constructor(private msDelay: number = UI_DELAY) { }

  public tima(eventEmittedValue?: T) {
    if (this.triggerSubscribe) {
      this.triggerSubscribe.unsubscribe();
    }
    this.triggerSubscribe = interval(this.msDelay)
      .subscribe(() => {
        this.event.emit(eventEmittedValue);
        if (this.triggerSubscribe) {
          this.triggerSubscribe.unsubscribe();
        }
      });
  }
}
