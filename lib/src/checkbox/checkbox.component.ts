/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { pluck } from 'rxjs/operators';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { toBoolean } from '@datorama/utils';
import { BaseCustomControl } from '../internal/base-custom-control';
import { DatoCoreError } from '../errors';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoCheckboxComponent),
  multi: true
};

@TakeUntilDestroy()
@Component({
  selector: 'dato-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'datoCheckbox',
  providers: [valueAccessor]
})
export class DatoCheckboxComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor {
  private _checked: boolean = false;

  /**
   * Whether the checkbox is checked.
   */
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    if (value !== this.checked) {
      this._checked = value;
      this.cdr.markForCheck();
    }
  }

  /**
   * Get the native input
   */
  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef, private host: ElementRef, @Attribute('trueValue') public trueValue, @Attribute('falseValue') public falseValue) {
    super();
    this.trueValue = toBoolean(this.trueValue) ? this.trueValue : true;
    this.falseValue = toBoolean(this.falseValue) ? this.falseValue : false;
  }

  ngOnInit() {
    fromEvent(this.inpuElement, 'change')
      .pipe(pluck('target', 'checked'), untilDestroyed(this))
      .subscribe(val => {
        this.onChange(val ? this.trueValue : this.falseValue);
        this.cdr.markForCheck();
      });
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.writeValue(!this.checked);
  }

  /**
   *
   * @param value
   */
  writeValue(value): void {
    /* check for a valid value */
    if (value == null || (value !== this.trueValue && value !== this.falseValue)) {
      throw new DatoCoreError(`Invalid checkbox value: ${value}`);
    }

    const normalizedValue = value === this.trueValue ? true : false;
    this.setInputValue(normalizedValue);
  }

  /**
   *
   * @param {boolean} isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.inpuElement, 'disabled', isDisabled);
  }

  ngOnDestroy(): void {}

  /**
   *
   * @param value
   */
  private setInputValue(value) {
    this.renderer.setProperty(this.inpuElement, 'checked', value);
  }
}
