import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[datoOrigin]'
})
export class DatoOriginDirective {
  click = fromEvent(this.element, 'click');

  constructor(public host: ElementRef) {}

  get element() {
    return this.host.nativeElement;
  }
}
