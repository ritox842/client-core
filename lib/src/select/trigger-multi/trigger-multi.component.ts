/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { last } from '@datorama/utils';
import { defaultOptionsDisplayLimit } from '../select.types';
import { TranslatePipe } from '../../../../playground/src/app/translate.pipe';

@Component({
  selector: 'dato-trigger-multi',
  templateUrl: './trigger-multi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTriggerMulti implements OnInit {
  maxActiveElementWidth: string;

  @ViewChild('input')
  input: ElementRef;

  _restCount = 0;
  @Input()
  control: FormControl;
  @Input()
  disabledIDs: string[] | number[];
  /**
   *
   * @type {string}
   */
  @Input()
  labelKey = 'label';
  @Output()
  removeOption = new EventEmitter();
  inputWidth: number;
  showClear = false;
  searchSubscription;

  constructor(private host: ElementRef<HTMLElement>, private translate: TranslatePipe) {}

  private _isFocused = false;

  @HostBinding('class.dato-trigger-multi--focused')
  get isFocused() {
    return this._isFocused;
  }

  set isFocused(value: boolean) {
    this._isFocused = value;
  }

  /**
   *
   * @type {string}
   * @private
   */
  private _placeholder = 'Search..';

  get placeholder(): string {
    return this._placeholder;
  }

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }

  private _isLoading = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input()
  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  /**
   *
   * @type {any[]}
   * @private
   */
  private _options = [];

  get options(): any[] {
    return this._options;
  }

  @Input()
  set options(value: any[]) {
    this._options = value.map(option => {
      return {
        ...option,
        [this.labelKey]: this.translate.transform(option[this.labelKey])
      };
    });
    this.setRestCount();
  }

  get showRest() {
    return this.options.length > this.limitTo;
  }

  /**
   *
   * @type {number}
   * @private
   */
  private _limitTo = defaultOptionsDisplayLimit;

  get limitTo(): number {
    return this._limitTo;
  }

  @Input()
  set limitTo(value: number) {
    this._limitTo = value;
    this.setRestCount();
  }

  /**
   *
   * @type {boolean}
   * @private
   */
  private _disabled = false;

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }

  /**
   *
   * @param {boolean} value
   */
  @Input()
  set clickOutside(value: boolean) {
    if (!!value) {
      this.isFocused = false;
      this.showClear = false;
      this.input.nativeElement.blur();
    }
  }

  @HostListener('click')
  onClick() {
    this.isFocused = true;
    Promise.resolve().then(() => this.input.nativeElement.focus());
  }

  ngOnInit() {
    const BASE_LENGTH = 13;
    this.inputWidth = this.placeholder.length * BASE_LENGTH;

    this.searchSubscription = this.control.valueChanges.subscribe(value => {
      this.showClear = !!value;
    });
  }

  /**
   *
   * @param option
   */
  remove(option) {
    this.removeOption.emit(option);
  }

  /**
   *
   * @param $event
   */
  removeFocus($event) {
    $event.stopPropagation();
    this.isFocused = false;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  clearSearch() {
    this.control.setValue('');
    this.input.nativeElement.focus();
  }

  /**
   * Remove option with keyboard
   * @param event
   */
  onKeyDown(event) {
    const BACKSPACE = event.keyCode === 8;
    const DELETE = event.keyCode === 46;
    const hasOptions = this.options.length >= 1;
    const emptySearch = !this.input.nativeElement.value;

    if ((BACKSPACE || DELETE) && hasOptions && emptySearch) {
      const lastOption = last(this.options);
      this.removeOption.emit(lastOption);
    }
  }

  /**
   * Check if given option id exist in disabledIDs array.
   * @param option
   */
  isDisabled(option) {
    return this.disabledIDs.indexOf(option.id) !== -1;
  }

  private setRestCount() {
    this._restCount = Math.abs(this.limitTo - this.options.length);
  }
}
