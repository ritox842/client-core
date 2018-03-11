import { Component, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dato-dropdown',
  styleUrls: [`./dropdown.component.scss`],
  template: `<ng-content></ng-content>`
})
export class DatoDropdownComponent {
  click = fromEvent(this.element, 'click');

  constructor(public host: ElementRef) {}

  get element(): HTMLElement {
    return this.host.nativeElement;
  }
}
