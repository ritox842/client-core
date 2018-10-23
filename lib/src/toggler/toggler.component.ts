/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { toBoolean } from '@datorama/utils';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoTogglerComponent),
  multi: true
};

@Component({
  selector: 'dato-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.scss'],
  providers: [valueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTogglerComponent extends BaseCustomControl implements ControlValueAccessor {
  private active = false;
  isDisabled = false;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  get isActive() {
    return this.active;
  }

  writeValue(value): void {
    this.active = toBoolean(value);
    this.cdr.markForCheck();
  }

  toggle() {
    if (this.isDisabled) return;
    this.active = !this.active;
    this.onChange(this.active);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
