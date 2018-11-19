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
  private _isFocused = false;

  @HostBinding('class.dato-trigger-multi--focused')
  get isFocused() {
    return this._isFocused;
  }
  set isFocused(value: boolean) {
    this._isFocused = value;
  }

  @Input()
  control: FormControl;

  @Input()
  disabledIDs: (string | number)[] = [];
  /**
   *
   * @type {string}
   * @private
   */
  private _placeholder = 'Search..';

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }
  get placeholder(): string {
    return this._placeholder;
  }

  private _isLoading = false;

  @Input()
  set isLoading(value: boolean) {
    this._isLoading = value;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }

  /**
   *
   * @type {any[]}
   * @private
   */
  private _options = [];

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
  get options(): any[] {
    return this._options;
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

  @Input()
  set limitTo(value: number) {
    this._limitTo = value;
    this.setRestCount();
  }
  get limitTo(): number {
    return this._limitTo;
  }

  /**
   *
   * @type {boolean}
   * @private
   */
  private _disabled = false;

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   *
   * @type {string}
   */
  @Input()
  labelKey = 'label';

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

  @Output()
  removeOption = new EventEmitter();

  inputWidth: number;
  showClear = false;
  searchSubscription;

  @HostListener('click')
  onClick() {
    this.isFocused = true;
    Promise.resolve().then(() => this.input.nativeElement.focus());
  }

  constructor(private host: ElementRef<HTMLElement>, private translate: TranslatePipe) {}

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

  ngAfterViewInit() {
    const SPACES = 100;
    this.maxActiveElementWidth = `${this.host.nativeElement.getBoundingClientRect().width - SPACES}px`;
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
