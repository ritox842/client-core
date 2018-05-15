/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { assertString } from '../errors';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoEditableHeaderComponent),
  multi: true
};

@Component({
  selector: 'dato-editable-header',
  templateUrl: './editable-header.component.html',
  styleUrls: ['./editable-header.component.scss'],
  providers: [valueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoEditableHeaderComponent extends BaseCustomControl implements ControlValueAccessor {
  private initialValue = '';
  private value = '';

  constructor(private renderer: Renderer2, private host: ElementRef) {
    super();
  }

  get isValueChanged() {
    return this.value !== this.initialValue;
  }

  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  blur() {
    /** If the value is empty go back to initial value */
    if (!this.value) {
      this.revert();
    }
  }

  focus($event) {
    if (!this.isValueChanged) {
      $event.target.setSelectionRange(0, 9999);
    }
  }

  revert() {
    this.onChange(this.initialValue);
    this.setInputValue(this.initialValue);
    this.value = this.initialValue;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.inpuElement, 'disabled', isDisabled);
  }

  writeValue(value: string) {
    assertString(value, this.constructor.name);
    this.initialValue = this.value = value;
    this.setInputValue(this.initialValue);
  }

  input({ target: { value } }) {
    this.onChange(value);
    this.value = value;
  }

  private setInputValue(value) {
    this.renderer.setProperty(this.inpuElement, 'value', value);
  }
}
