import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[datoSortableHandle]'
})
export class DatoSortableHandleDirective {
  constructor(private renderer: Renderer2, private host: ElementRef) {
    renderer.addClass(host.nativeElement, 'dato-sortable-handler');
  }
}
