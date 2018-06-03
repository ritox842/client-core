/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime, tap } from 'rxjs/operators';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { toBoolean } from '@datorama/utils';
import { BaseCustomControl } from '../internal/base-custom-control';

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
  _checked = false;

  @Input()
  set checked(value: boolean) {
    this._checked = value;
    this.setInputValue(value);
    this.cdr.markForCheck();
  }

  @Output() check = new EventEmitter();

  /**
   * Get the native input
   */
  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  get checkMarkElement() {
    return this.host.nativeElement.querySelector('.checkmark');
  }

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef, private host: ElementRef, @Attribute('trueValue') public trueValue, @Attribute('falseValue') public falseValue) {
    super();
    this.trueValue = toBoolean(this.trueValue) ? this.trueValue : true;
    this.falseValue = toBoolean(this.falseValue) ? this.falseValue : false;
  }

  ngOnInit() {
    fromEvent(this.checkMarkElement, 'click')
      .pipe(tap((event: MouseEvent) => event.stopPropagation()), debounceTime(30), untilDestroyed(this))
      .subscribe(() => {
        this._checked = !this._checked;
        const normalized = this._checked ? this.trueValue : this.falseValue;
        this.onChange(normalized);
        this.check.emit(normalized);
        this.cdr.markForCheck();
      });
  }

  /**
   *
   * @param value
   */
  writeValue(value): void {
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
