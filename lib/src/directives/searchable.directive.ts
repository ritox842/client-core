/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[datoSearchable]'
})
export class DatoSearchableDirective {
  @Input()
  set datoSearchable(term) {
    this._term = term || '';
  }

  private _term = '';

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
