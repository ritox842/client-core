/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { getOptionTemplate } from './option-template';

@Component({
  selector: 'dato-option:not([multi])',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: getOptionTemplate()
})
export class DatoOptionComponent implements OnInit {
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

  @Input()
  set disabled(value) {
    if (!!value) {
      this._permanentDisabled = true;
    } else {
      this._permanentDisabled = false;
    }
    if (value !== this._disabled) {
      this._disabled = value;
      this.detectChanges();
    }
  }

  get disabled() {
    return this._disabled;
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

  _option;
  _disabled = false;
  _activeByKeyboard = false;
  _active = false;
  _hide = false;

  /** We need to know when the it's permanent so we can mark it as disable */
  _permanentDisabled = false;

  click$ = fromEvent(this.element, 'click');

  constructor(protected cdr: ChangeDetectorRef, protected host: ElementRef) {}

  ngOnInit() {
    this.cdr.detach();
  }

  get element() {
    return this.host.nativeElement;
  }

  private detectChanges() {
    this.cdr.detectChanges();
  }

  /**
   *
   * @param value
   */
  hideAndDisabled(value) {
    let needCd = false;

    if (!this._permanentDisabled && value !== this._disabled) {
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
