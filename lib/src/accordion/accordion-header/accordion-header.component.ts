/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ElementRef, HostBinding, Input, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'dato-accordion-header',
  template: '<div class="d-flex items-center">' + '<dato-icon *ngIf="includeArrow && !_expanded" datoIcon="arrow-right" datoSize="sm" class="mx-8"></dato-icon>' + '<dato-icon *ngIf="includeArrow && _expanded" datoIcon="arrow-down" datoSize="sm" class="mx-8"></dato-icon>' + '<ng-content></ng-content></div>',
  styles: [
    `
            :host {
                display: block;
            }`
  ]
})
export class DatoAccordionHeaderComponent {
  @HostBinding('class.dato-accordion-open') _expanded = false;

  @Input()
  set expanded(value) {
    this._expanded = value;
    this.cdr.markForCheck();
  }

  click$ = fromEvent(this.element, 'click');

  includeArrow = false;

  constructor(public host: ElementRef, private cdr: ChangeDetectorRef) {}

  get element() {
    return this.host.nativeElement;
  }
}
