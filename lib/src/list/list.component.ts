/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatoTranslateService } from '../services/translate.service';
import { BaseCustomControl } from '../internal/base-custom-control';
import { coerceArray } from '@datorama/utils';
import { debounceTime, mapTo } from 'rxjs/operators';
import { DatoOptionComponent } from '../options/option.component';
import { DatoSelectSearchStrategy, defaultClientSearchStrategy } from '../select/search.strategy';
import { DatoGroupComponent } from '../options/group.component';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { ListKeyManager } from '@angular/cdk/a11y';
import { merge } from 'rxjs';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoListComponent),
  multi: true
};

@Component({
  selector: 'dato-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  preserveWhitespaces: false,
  providers: [valueAccessor],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoListComponent extends BaseCustomControl implements OnInit, ControlValueAccessor, AfterContentInit, OnDestroy {
  /** QueryList of datoOptions children */
  @ContentChildren(DatoOptionComponent, { descendants: true })
  options: QueryList<DatoOptionComponent>;

  /** QueryList of datoGroups children */
  @ContentChildren(DatoGroupComponent) groups: QueryList<DatoGroupComponent>;

  /** The options to display in the dropdown */
  @Input()
  set dataSet(data: any[]) {
    this._data = data;

    /** If it's async updates, create micro task in order to re-subscribe to clicks */
    if (this._dataIsDirty) {
      Promise.resolve().then(() => {
        this.subscribeToOptionClick(this.options);
        this.markAsActive(this._model);
      });
    }

    this._dataIsDirty = true;
  }

  /** Debounce time to emit search queries */
  @Input() debounceTime = 300;

  /** The key that stores the option id */
  @Input() idKey = 'id';

  /** Whether to show loading indicator */
  @Input() isLoading = false;

  /** The lookup key for the label */
  @Input() labelKey = 'label';

  /**
   * Getters and Setters
   */
  get data() {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  get hasResults() {
    return this._hasResults;
  }

  set hasResults(value: boolean) {
    this._hasResults = value;
  }

  get hasValue() {
    return this._model.length;
  }

  /** FormControl which listens for search value changes */
  searchControl = new FormControl();

  /**
   * Private Properties
   */

  /** Store the initial data */
  _data = [];

  /** Indicates whether we already initialized the data,
   *  This is optimization for non async calls.
   * */
  _dataIsDirty = false;

  /** Enable/disable the select-trigger */
  _disabled;

  /** Triggers the focus on the input */
  _focus = false;

  /** Whether we have search results */
  _hasResults = true;

  /** Store the active options */
  _model = [];

  _searchPlaceholder = this.translate.transform('general.search');

  /** Clicks options subscription */
  private clicksSubscription;

  /** Keyboard Manager */
  private keyboardEventsManager: ListKeyManager<DatoOptionComponent>;

  private searchStrategy: DatoSelectSearchStrategy = defaultClientSearchStrategy;

  /** Search control subscription */
  private searchSubscription;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService) {
    super();
  }

  ngOnInit() {
    this.listenToSearch();
  }

  ngAfterContentInit(): void {
    this.subscribeToOptionClick(this.options);
  }

  ngOnDestroy() {}

  /**
   *
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  keyup(event: KeyboardEvent) {
    event.stopPropagation();

    if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
      this.keyboardEventsManager.onKeydown(event);
      return false;
    } else if (event.keyCode === ENTER) {
      const index = this.keyboardEventsManager.activeItemIndex;
      const active = this.options.toArray()[index];
      this.handleClick(active);
      return false;
    }
  }

  /**
   *
   * @param {boolean} isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdr.markForCheck();
  }

  /**
   *
   * @param {any | any[]} activeOptions
   */
  writeValue(activeOptions: any | any[]): void {
    this._model = activeOptions ? coerceArray(activeOptions) : [];
    /**
     * When we first open the dropdown we need to mark the
     * FormControl values as actives
     */
    setTimeout(() => {
      if (this.hasValue) {
        this.markAsActive(this._model);
      }
    }, 0);
    /** For later updates */
    this.cdr.markForCheck();
  }

  /**
   *
   * @param {DatoOptionComponent} datoOption
   */
  private handleClick(datoOption: DatoOptionComponent) {
    datoOption.active = !datoOption.active;
    const rawOption = datoOption.option;
    if (datoOption.active) {
      this._model = this._model.concat(rawOption);
    } else {
      this._model = this._model.filter(current => current[this.idKey] !== rawOption[this.idKey]);
    }
    this.onChange(this._model);
    this.cdr.markForCheck();
  }

  /**
   *
   * @param {string} value
   * @returns {boolean}
   */
  private isEmpty(value: string) {
    return value === '';
  }

  /**
   * Subscribe to search changes and filter the list
   */
  private listenToSearch() {
    this.searchSubscription = this.searchControl.valueChanges.pipe(debounceTime(this.debounceTime)).subscribe(value => {
      if (this.isEmpty(value)) {
        this.showAll();
        this.hasResults = true;
      } else {
        this.hasResults = this.searchOptions(value);
      }
      this.keyboardEventsManager.setActiveItem(0);

      this.cdr.markForCheck();
    });
  }

  /**
   * Mark the initial control value as active
   * @param model
   */
  private markAsActive(model: any[]) {
    const asArray = this.options.toArray();
    for (const option of model) {
      const match = asArray.find(current => current.option[this.idKey] === option[this.idKey]);
      if (match) {
        match.active = true;
      }
    }
  }

  /**
   * Search for options and returns if we have result
   * @param {string} value
   * @returns {boolean}
   */
  private searchOptions(value: string) {
    let hasResult = false;

    for (let datoOption of this.options.toArray()) {
      const match = this.searchStrategy(datoOption, value, this.labelKey);

      if (!match) {
        datoOption.hideAndDisabled(true);
      } else {
        datoOption.hideAndDisabled(false);
        hasResult = true;
      }
    }
    return hasResult;
  }

  /**
   * Show all options
   */
  private showAll() {
    for (let datoOption of this.options.toArray()) {
      datoOption.hideAndDisabled(false);
    }
  }

  /**
   * Subscribe to option click and change the state accordingly
   * @param {DatoOptionComponent[]} options
   */
  private subscribeToOptionClick(options: QueryList<DatoOptionComponent>) {
    this.clicksSubscription && this.clicksSubscription.unsubscribe();

    /** Gather all the clicks */
    const clicks$ = options.map(option => option.click$.pipe(mapTo(option)));

    /** Consider change it to use event delegation */
    this.clicksSubscription = merge(...clicks$)
      .pipe(debounceTime(10))
      .subscribe((datoOption: DatoOptionComponent) => {
        if (datoOption.disabled) return;
        this.handleClick(datoOption);
      });
  }
}
