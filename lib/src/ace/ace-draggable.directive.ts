import { Attribute, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[aceDraggableText]'
})
export class DatoAceDraggableDirective {
  constructor(private host: ElementRef<HTMLElement>, @Attribute('aceDraggableText') private text) {
    this.host.nativeElement.setAttribute('draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  private drag(event) {
    event.dataTransfer.setData('text', this.text);
  }
}
