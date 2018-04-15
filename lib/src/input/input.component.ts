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
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { animate, style, transition, trigger } from '@angular/animations';
import { optionalDebounce } from '../rx/debounce';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoInputComponent),
  multi: true
};

const TIMING = 250;

const animations = [trigger('fromRight', [transition(':enter', [style({ transform: 'translateX(100px)' }), animate(TIMING, style({ transform: 'translateX(0)' }))]), transition(':leave', [animate(TIMING, style({ transform: 'translateX(100px)' }))])]), trigger('fromUp', [transition(':enter', [style({ transform: 'translateY(100px)' }), animate(TIMING, style({ transform: 'translateY(0)' }))]), transition(':leave', [animate(TIMING, style({ transform: 'translateY(100px)' }))])])];

@TakeUntilDestroy()
@Component({
  selector: 'dato-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  animations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [valueAccessor]
})
export class DatoInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  showDelete = false;

  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() debounceTime;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(@Attribute('type') public type, private renderer: Renderer2, private cdr: ChangeDetectorRef, private host: ElementRef) {}

  ngOnInit() {
    fromEvent(this.inpuElement, 'input')
      .pipe(pluck('target', 'value'), tap(val => this.activateDeleteIcon(val)), optionalDebounce(this.debounceTime), untilDestroyed(this))
      .subscribe(val => {
        this.onChange(val);
        this.cdr.markForCheck();
      });
  }

  /**
   * Get the native input
   */
  get inpuElement() {
    return this.host.nativeElement.querySelector('input');
  }

  /**
   *
   * @returns {boolean}
   */
  get showSearch() {
    return this.type === 'search' && !this.showDelete;
  }

  /**
   * Delete the value when click on the X
   */
  delete() {
    if (this.showDelete) {
      const value = '';
      this.activateDeleteIcon(value);
      this.setInputValue(value);
      this.onChange(value);
    }
  }

  /**
   *
   * @param value
   */
  writeValue(value): void {
    const normalizedValue = value == null ? '' : value;
    this.activateDeleteIcon(normalizedValue);
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
    this.renderer.setProperty(this.inpuElement, 'value', value);
  }

  /**
   *
   * @param value
   */
  private activateDeleteIcon(value) {
    if (value) {
      this.showDelete = true;
    } else {
      this.showDelete = false;
    }
    this.cdr.detectChanges();
  }
}
