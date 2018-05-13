import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Directive({
  selector: '[datoDialogCloseButton]'
})
export class DialogCloseButtonDirective {
  click$ = fromEvent(this.host.nativeElement, 'click');

  constructor(private host: ElementRef) {}
}
