/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/observable';

@Component({
  selector: 'dato-accordion-header',
  template: '<ng-content></ng-content>',
  styles: [
    `
    :host {
      display: block;
    }`
  ]
})
export class DatoAccordionHeaderComponent {
  @HostBinding('class.dato-accordion-open')
  @Input()
  expanded;

  click$ = fromEvent(this.element, 'click');

  constructor(public host: ElementRef) {}

  get element() {
    return this.host.nativeElement;
  }
}
