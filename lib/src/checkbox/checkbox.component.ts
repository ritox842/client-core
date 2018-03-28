/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { pluck, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

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
export class DatoCheckboxComponent implements OnInit, OnDestroy, ControlValueAccessor {
  destroyed$: Observable<boolean>;

  private _checked: boolean = false;

  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    if (value != this.checked) {
      this._checked = value;
      this.cdr.markForCheck();
    }
  }

  @Input() disabled = false;

  /**
   * Get the native input
   */
  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private host: ElementRef,
    @Attribute('trueValue') public trueValue,
    @Attribute('falseValue') public falseValue
  ) {
    this.trueValue = this.trueValue == null ? true : this.trueValue;
    this.falseValue = this.falseValue == null ? false : this.falseValue;
  }

  ngOnInit() {
    fromEvent(this.inpuElement, 'change')
      .pipe(pluck('target', 'checked'), takeUntil(this.destroyed$))
      .subscribe(val => {
        this.onChange(val ? this.trueValue : this.falseValue);
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
    const normalizedValue = value === this.trueValue ? true : false;
    this.setInputValue(normalizedValue);
  }

  /**
   *
   * @param {(_: any) => void} fn
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /**
   *
   * @param {() => void} fn
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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
