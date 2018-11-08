import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[datoSearchable]'
})
export class DatoSearchableDirective {
  private _term: string;

  @Input()
  set datoSearchable(term) {
    this._term = term || '';
  }

  constructor(private host: ElementRef) {}

  get element() {
    return this.host.nativeElement;
  }

  get term() {
    return this._term.toLowerCase();
  }

  hide() {
    this.element.classList.add('force-hide');
  }

  show() {
    this.element.classList.remove('force-hide');
  }
}
