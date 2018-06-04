/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

export function getMultiTemplate() {
  return `
      <div class="dato-checkbox"><label><p datoFont><ng-content></ng-content></p><input type="checkbox" [checked]="_active" [disabled]="_disabled"><span class="checkmark"></span></label></div>
  `;
}

export function getOptionTemplate(isMulti = false) {
  return `
    <div class="dato-select__option dato-select__option--hover"
         [class.force-hide]="_hide"
         ${isMulti ? '' : '[class.dato-option--active]="_active"'}
         [class.dato-select__option--disabled]="_disabled">
      ${isMulti ? getMultiTemplate() : '<ng-content></ng-content>'} 
    </div>
  `;
}

@Component({
  selector: 'dato-option:not([multi])',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: getOptionTemplate()
})
export class DatoSelectOptionComponent implements OnInit {
  get option() {
    return this._option;
  }

  @Input()
  set option(value) {
    if (value !== this._option) {
      this._option = value;
      this.detectChanges();
    }
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  set disabled(value) {
    if (value !== this._disabled) {
      this._disabled = value;
      this.detectChanges();
    }
  }

  get active() {
    return this._active;
  }

  @Input()
  set active(value) {
    if (value !== this._active) {
      this._active = value;
      this.detectChanges();
    }
  }

  get hide() {
    return this._hide;
  }

  @Input()
  set hide(value) {
    if (value !== this._hide) {
      this._hide = value;
      this.detectChanges();
    }
  }

  _option;
  _disabled = false;
  _active = false;
  _hide = false;

  click$ = fromEvent(this.element, 'click');

  constructor(protected cdr: ChangeDetectorRef, protected host: ElementRef) {}

  ngOnInit() {
    this.cdr.detach();
  }

  get element() {
    return this.host.nativeElement;
  }

  detectChanges() {
    this.cdr.detectChanges();
  }
}
