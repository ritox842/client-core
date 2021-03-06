/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Output, OnInit, EventEmitter, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { toBoolean } from '@datorama/utils';
import { addClass, query, setStyle } from '../internal/helpers';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
export class DatoEditableHeaderComponent extends BaseCustomControl implements OnInit, ControlValueAccessor {
  @Input() placeholder = '';
  @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  private initialValue = '';
  private value = '';

  constructor(private renderer: Renderer2, private host: ElementRef, @Attribute('datoSmall') public small, @Attribute('fontSize') public fontSize, @Attribute('standalone') public standalone, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    if (toBoolean(this.standalone)) {
      this.renderer.addClass(this.host.nativeElement, 'standalone');
    }

    const input = query('.editable-header-input', this.host.nativeElement);
    setStyle(input, 'fontSize', this.fontSize);

    if (coerceBooleanProperty(this.small)) {
      addClass(input, 'editable-header-input--small');
    }
  }

  get isValueChanged() {
    return this.value !== this.initialValue;
  }

  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  blur($event) {
    /** If the value is empty go back to initial value */
    if (!this.value) {
      this.revert();
    }
    this.onBlur.emit($event);
  }

  focus($event) {
    if (!this.isValueChanged) {
      $event.target.setSelectionRange(0, 9999);
    }
    this.onFocus.emit($event);
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
    if (!this.initialValue) {
      this.initialValue = value;
    }
    this.value = value;
    this.setInputValue(value);
    this.cdr.markForCheck();
  }

  input({ target: { value } }) {
    this.onChange(value);
    this.value = value;
  }

  private setInputValue(value) {
    this.renderer.setProperty(this.inpuElement, 'value', value);
  }
}
