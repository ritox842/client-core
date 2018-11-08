/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ElementRef, HostBinding, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'dato-accordion-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion-header.component.html',
  exportAs: 'datoAccordionHeader',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class DatoAccordionHeaderComponent {
  @HostBinding('class.dato-accordion-open')
  _expanded = false;

  @Input()
  set expanded(value) {
    if (this._expanded !== value) {
      this._expanded = value;
      this.cdr.detectChanges();
    }
  }

  get includeArrow() {
    return this._includeArrow;
  }

  set includeArrow(value) {
    this._includeArrow = value;
    this.cdr.detectChanges();
  }

  click$ = fromEvent(this.element, 'click');

  get element() {
    return this.host.nativeElement;
  }

  get isOpen() {
    return this._expanded;
  }

  set searchResultLength(value: number) {
    this._searchResultLength = value;
  }

  get searchResultLength() {
    return this._searchResultLength;
  }

  private _searchResultLength = 0;
  private _includeArrow = false;

  constructor(public host: ElementRef, private cdr: ChangeDetectorRef) {}
}
