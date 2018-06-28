/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatoTranslateService } from '../services/translate.service';
import { BaseCustomControl } from '../internal/base-custom-control';
import { coerceArray } from '@datorama/utils';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoListComponent),
  multi: true
};

@Component({
  selector: 'dato-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [valueAccessor]
})
export class DatoListComponent extends BaseCustomControl implements OnInit, ControlValueAccessor, OnDestroy {
  /** Store the initial data */
  _data = [];

  /** Indicates whether we already initialized the data,
   *  This is optimization for non async calls.
   * */
  _dataIsDirty = false;

  @Input() actionName = 'share';
  /** The options to display in the dropdown */
  @Input()
  set dataSet(data: any[]) {
    this._data = data;

    /** If it's async updates, create micro task in order to re-subscribe to clicks */
    if (this._dataIsDirty) {
      Promise.resolve().then(() => {
        // this.subscribeToOptionClick(this.options);
        // this.markAsActive(this._model);
      });
    }

    this._dataIsDirty = true;
  }

  /** Emit when user clicks the action button */
  @Output() action = new EventEmitter<string>();

  /** Store the actives options */
  _model = [];

  /**
   * Getters and Setters
   */
  get data() {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  buttons = { action: '', cancel: '' };
  search = new FormControl();

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService) {
    super();
  }

  ngOnInit() {
    this.translateButtonNames();
  }

  ngOnDestroy() {}

  performAction() {
    this.action.emit();
  }

  /**
   *
   * @param {any | any[]} activeOptions
   */
  writeValue(activeOptions: any | any[]): void {
    this._model = activeOptions ? coerceArray(activeOptions) : [];
    /** For later updates */
    this.cdr.markForCheck();
  }

  private translateButtonNames() {
    this.buttons.action = this.translate.transform(this.actionName);
    this.buttons.cancel = this.translate.transform('cancel');
  }
}
