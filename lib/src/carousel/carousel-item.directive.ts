import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[datoCarouselItem]'
})
export class DatoCarouselItemDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
