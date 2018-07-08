/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, forwardRef, Input, OnDestroy, OnInit, QueryList, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatoTranslateService } from '../services/translate.service';
import { BaseCustomControl } from '../internal/base-custom-control';
import { coerceArray, toBoolean } from '@datorama/utils';
import { debounceTime, mapTo } from 'rxjs/operators';
import { DatoOptionComponent } from '../options/option.component';
import { DatoGroupComponent } from '../options/group.component';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { ListKeyManager } from '@angular/cdk/a11y';
import { merge } from 'rxjs';
import { DatoAccordionComponent, DatoAccordionGroupComponent } from '../../';
import { query } from '../internal/helpers';
import { getListOptionHeight } from './list-size';
import { DatoListSearchStrategy, defaultClientSearchStrategy } from './search.strategy';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoListComponent),
  multi: true
};

@Component({
  selector: 'dato-list',
  templateUrl: './list.component.html',
  providers: [valueAccessor],
  preserveWhitespaces: false,
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoListComponent extends BaseCustomControl implements OnInit, ControlValueAccessor, AfterContentInit, OnDestroy {
  /** QueryList of datoOptions children */
  @ContentChildren(DatoOptionComponent, { descendants: true })
  options: QueryList<DatoOptionComponent>;

  /** QueryList of datoGroups children */
  @ContentChildren(DatoGroupComponent) groups: QueryList<DatoGroupComponent>;

  /** QueryList of datoAccordionGroups children */
  @ContentChildren(forwardRef(() => DatoAccordionComponent), { descendants: true })
  accordion: QueryList<DatoAccordionComponent>;

  /** autoFocus on search input element */
  @Input() autoFocus = true;

  /** The options to display in the list */
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

  /** Client search strategy */
  @Input() searchStrategy: DatoListSearchStrategy = defaultClientSearchStrategy;

  /** Debounce time to emit search queries */
  @Input() debounceTime = 300;

  /** The key that stores the option id */
  @Input() idKey = 'id';

  /** Whether to show loading indicator */
  @Input() isLoading = false;

  /** The lookup key for the label */
  @Input() labelKey = 'label';

  /** Search groups as well as options */
  @Input() searchGroupLabels = true;

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

  /** Whether we have search results */
  _hasResults = true;

  /** Store the active options */
  _model = [];

  _searchPlaceholder = this.translate.transform('general.search');

  /** Clicks options subscription */
  private clicksSubscription;

  /** Current index of active item (keyboard navigation) */
  private currentIndex;

  /** Keyboard Manager */
  private keyboardEventsManager: ListKeyManager<DatoOptionComponent>;

  /** Keyboard subscription */
  private keyboardEventsManagerSubscription;

  /** Search control subscription */
  private searchSubscription;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService, private host: ElementRef) {
    super();
  }

  ngOnInit() {
    this.listenToSearch();
  }

  ngAfterContentInit(): void {
    this.subscribeToOptionClick(this.options);
    this.keyboardEventsManager = new ListKeyManager(this.options).withWrap().withVerticalOrientation(true);
    this.keyboardEventsManagerSubscription = this.keyboardEventsManager.change.subscribe(index => {
      const options = this.options.toArray();
      if (options.length) {
        options.forEach(datoOption => (datoOption.activeByKeyboard = false));
        options[index].activeByKeyboard = true;
        this.scrollToElement(index);
      }
    });
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
     * When we first open the list we need to mark the
     * FormControl values as actives
     */
    if (this.hasValue) {
      setTimeout(() => {
        this.markAsActive(this._model);
      }, 0);
    }

    /** For later updates */
    this.cdr.markForCheck();
  }

  private getGroupComponentsArray(): DatoAccordionGroupComponent[] | DatoGroupComponent[] {
    return this.accordion.length ? this.accordion.first.groups.toArray() : this.groups.toArray();
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
        const groupComponentsArray = this.getGroupComponentsArray();
        (groupComponentsArray as any[]).forEach((groupComponent: DatoGroupComponent | DatoAccordionGroupComponent) => {
          groupComponent._hidden = false;
        });
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
   *
   * @param {number} index
   */
  private scrollToElement(index: number) {
    const optionsContainer = query('.dato-list__options', this.host.nativeElement);
    if (!optionsContainer) return;

    let scrollTop = optionsContainer.scrollTop;
    const LAST = this.options.filter(datoOption => !datoOption.disabled).length;

    if (index === 0) {
      scrollTop = 0;
    } else if (index === LAST) {
      scrollTop = optionsContainer.scrollHeight;
    } else {
      const optionHeight = getListOptionHeight();
      if (this.currentIndex > index) {
        scrollTop = optionsContainer.scrollTop - optionHeight;
      } else {
        scrollTop = optionHeight + optionsContainer.scrollTop;
      }
    }

    optionsContainer.scrollTop = scrollTop;
    this.currentIndex = index;
  }

  /**
   * Search for options and returns if we have result
   * @param {string} value
   * @returns {boolean}
   */
  private searchOptions(value: string) {
    const results = [];
    const groupComponentsArray = this.getGroupComponentsArray();

    this._data.forEach((group, index) => {
      const matchGroup = this.searchStrategy(group, value, this.labelKey);
      if (this.searchGroupLabels && matchGroup) {
        /** show entire group */
        group.children.forEach(option => {
          results.push(option[this.idKey]);
        });

        groupComponentsArray[index]._hidden = false;
      } else {
        let showGroup = false;
        group.children.forEach(option => {
          const matchOption = option[this.labelKey].toLowerCase().indexOf(value) > -1;
          if (matchOption) {
            showGroup = true;
            /** show option */
            results.push(option[this.idKey]);
          }
        });
        groupComponentsArray[index]._hidden = !showGroup;
      }
    });

    for (let datoOption of this.options.toArray()) {
      if (results.indexOf(datoOption.option[this.idKey]) > -1) {
        datoOption.hideAndDisabled(false);
      } else {
        datoOption.hideAndDisabled(true);
      }
    }

    return toBoolean(results.length);
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
