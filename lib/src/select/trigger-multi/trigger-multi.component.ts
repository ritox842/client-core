/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-trigger-multi',
  templateUrl: './trigger-multi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTriggerMulti implements OnInit {
  @ViewChild('input') input: ElementRef;

  private _isFocused = false;

  @HostBinding('class.dato-trigger-multi--focused')
  get isFocused() {
    return this._isFocused;
  }

  set isFocused(value: boolean) {
    this._isFocused = value;
  }

  @Input() control: FormControl;

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
    this._options = value;
  }

  /**
   *
   * @type {number}
   * @private
   */
  private _limitTo = 10;

  get limitTo(): number {
    return this._limitTo;
  }

  @Input()
  set limitTo(value: number) {
    this._limitTo = value;
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
   * @type {string}
   */
  @Input() labelKey = 'label';

  /**
   *
   * @param {boolean} value
   */
  @Input()
  set clickOutside(value: boolean) {
    if (!!value) {
      this.isFocused = false;
      this.showClear = false;
    }
  }

  @Output() removeOption = new EventEmitter();

  inputWidth: number;
  showClear = false;
  searchSubscription;

  @HostListener('click')
  onClick() {
    this.isFocused = true;
    this.input.nativeElement.focus();
  }

  ngOnInit() {
    this.inputWidth = this.placeholder.length * 13;

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
}
