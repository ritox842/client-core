/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { pluck } from 'rxjs/operators';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoRadioComponent),
  multi: true
};

@TakeUntilDestroy()
@Component({
  selector: 'dato-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'datoRadio',
  providers: [valueAccessor]
})
export class DatoRadioComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() name;
  @Input() value;

  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  id = Math.random().toString();

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef, private host: ElementRef) {}

  ngOnInit() {
    fromEvent(this.inpuElement, 'change')
      .pipe(pluck('target', 'value'), untilDestroyed(this))
      .subscribe(val => {
        this.onChange(val);
      });
  }

  /**
   *
   * @param value
   */
  writeValue(value): void {
    this.setInputValue(value === this.value);
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
