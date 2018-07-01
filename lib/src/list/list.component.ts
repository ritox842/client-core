/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatoTranslateService } from '../services/translate.service';
import { BaseCustomControl } from '../internal/base-custom-control';
import { coerceArray } from '@datorama/utils';
import { debounceTime } from 'rxjs/operators';
import { DatoOptionComponent } from '../options/option.component';
import { DatoSelectSearchStrategy, defaultClientSearchStrategy } from '../select/search.strategy';
import { DatoGroupComponent } from '../options/group.component';

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
export class DatoListComponent extends BaseCustomControl implements OnInit, ControlValueAccessor, OnDestroy {
  /** QueryList of datoOptions children */
  @ContentChildren(DatoOptionComponent, { descendants: true })
  options: QueryList<DatoOptionComponent>;

  /** QueryList of datoGroups children */
  @ContentChildren(DatoGroupComponent) groups: QueryList<DatoGroupComponent>;

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

  /** Debounce time to emit search queries */
  @Input() debounceTime = 300;

  /** Whether to show loading indicator */
  @Input() isLoading = false;

  /** The lookup key for the label */
  @Input() labelKey = 'label';

  /** Emit when user clicks the action button */
  @Output() action = new EventEmitter<string>();

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

  buttonNames = { action: '', cancel: '' };

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

  /** Whether we have search results */
  _hasResults = true;

  /** Store the active options */
  _model = [];

  _searchPlaceholder = this.translate.transform('general.search');

  private searchStrategy: DatoSelectSearchStrategy = defaultClientSearchStrategy;

  /** Search control subscription */
  private searchSubscription;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService) {
    super();
  }

  ngOnInit() {
    this.translateButtonNames();
    this.listenToSearch();
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
      // this.keyboardEventsManager.setActiveItem(0);

      this.cdr.markForCheck();
      // this.datoOverlay && this.datoOverlay.scheduleUpdate();
    });
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

  private translateButtonNames() {
    this.buttonNames.action = this.translate.transform(this.actionName);
    this.buttonNames.cancel = this.translate.transform('general.cancel');
  }
}
