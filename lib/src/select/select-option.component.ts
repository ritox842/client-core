/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

export function getMultiTemplate() {
  return `
      <div class="dato-checkbox"><label><p datoFont><ng-content></ng-content></p><input type="checkbox" [checked]="_active" [disabled]="_disabled"><span class="checkmark"></span></label></div>
  `;
}

export function getOptionTemplate(isMulti = false) {
  return `
    <div class="dato-select__option  dato-select__option--simple dato-select__option--hover"
         [class.force-hide]="hide"
         ${isMulti ? '' : '[class.dato-option--active]="active"'}
         [class.dato-select__option--disabled]="permanentDisabled"
         [class.dato-option--keyboard-active]="activeByKeyboard"
         >
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

  get permanentDisabled() {
    return this._permanentDisabled;
  }

  @Input('disabled')
  set permanentDisabled(value) {
    if (value !== this._permanentDisabled) {
      this._permanentDisabled = value;
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

  get activeByKeyboard() {
    return this._activeByKeyboard;
  }

  @Input()
  set activeByKeyboard(value) {
    if (value !== this._activeByKeyboard) {
      this._activeByKeyboard = value;
      this.detectChanges();
    }
  }

  get disabled() {
    return this._disabled;
  }

  _option;
  _disabled = false;
  _activeByKeyboard = false;
  _active = false;
  _hide = false;

  /**
   * We need to distinguish between this param to `disabled`.
   * `disabled` used by the keyManager and skip it. (When searching we mark the item as disabled which leads the keyMangaer to skip it)
   * `permanentDisabled` is the real disabled value - for CSS purposes.
   * @type {boolean}
   * @private
   */
  _permanentDisabled = false;

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

  /**
   *
   * @param value
   */
  hideAndDisabled(value) {
    let needCd = false;
    if (value !== this._disabled) {
      needCd = true;
      this._disabled = value;
    }

    if (value !== this._hide) {
      needCd = true;
      this._hide = value;
    }

    if (needCd) {
      this.detectChanges();
    }
  }
}
