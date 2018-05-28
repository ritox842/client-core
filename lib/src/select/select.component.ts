/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, forwardRef, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import Popper from 'popper.js';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoSelectComponent),
  multi: true
};

@Component({
  selector: 'dato-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [valueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoSelectComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('origin') origin: ElementRef;

  private popper: Popper;

  constructor() {
    super();
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    console.log(this.dropdown.nativeElement);
    console.log(this.origin.nativeElement);
  }

  setDisabledState(isDisabled: boolean): void {}

  writeValue(obj: any): void {}

  ngOnDestroy() {}
}
