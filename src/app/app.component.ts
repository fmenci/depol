import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-depol',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'depol';
}
