import { Directive, ElementRef, Input } from '@angular/core';
import { toBoolean } from '@datorama/utils';

@Directive({
  selector: '[datoAutoFocus]'
})
export class DatoAutoFocusDirective {
  @Input()
  public set datoAutoFocus(value) {
    if (toBoolean(value)) {
      this.host.nativeElement.focus();
    }
  }

  public constructor(private host: ElementRef) {}
}
