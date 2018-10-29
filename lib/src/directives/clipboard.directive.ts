import { Directive, HostListener, Input } from '@angular/core';
import { appendToBody, createElement, setStyles } from '../internal/helpers';

@Directive({
  selector: '[datoClipboard]'
})
export class DatoClipboardDirective {
  private value: string;

  @Input()
  set datoClipboard(value: string) {
    this.value = value;
  }

  @HostListener('click')
  onClick() {
    this.copy(this.value);
  }

  private copy(value: string) {
    const el = createElement('textarea') as HTMLTextAreaElement;
    el.value = value;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    setStyles(el, { position: 'absolute', left: '-9999px' });
    const remove = appendToBody(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    remove();
  }
}
