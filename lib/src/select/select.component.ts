/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { coerceArray } from '@datorama/utils';
import { SelectType } from './select.types';
import { DatoSelectOptionComponent } from './select-option.component';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, mapTo, take } from 'rxjs/operators';
import { DatoSelectActiveDirective } from './select-active.directive';
import { DatoSelectSearchStrategy, defaultClientSearchStrategy } from './search.strategy';
import { Placement, PopperOptions } from 'popper.js';
import { query, setStyle } from '../internal/helpers';
import { DatoOverlay, DatoTemplatePortal } from '../angular/overlay';
import { ListKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { getSelectOptionHeight } from './select-size';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoSelectComponent),
  multi: true
};

@Component({
  selector: 'dato-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  preserveWhitespaces: false,
  providers: [valueAccessor, DatoOverlay],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'datoSelect'
})
export class DatoSelectComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {
  /** The dropdown container element which is the portal  **/
  @ViewChild('dropdown') dropdown: TemplateRef<any>;

  /** The overlay origin which is one of dato-triggers **/
  @ViewChild('overlayOrigin') origin: ElementRef;

  /** QueryList of datoSelectOptions childs */
  @ContentChildren(DatoSelectOptionComponent, { descendants: true })
  options: QueryList<DatoSelectOptionComponent>;

  /** Allowing custom template by passing *datoActive directive which gets the active as context */
  @ContentChild(DatoSelectActiveDirective) active: DatoSelectActiveDirective;

  /** The key that stores the option id */
  @Input() idKey = 'id';

  /** The lookup key for the label */
  @Input() labelKey = 'label';

  /** A placeholder for the trigger */
  @Input() placeholder = 'Select..';

  /** A placeholder for the search */
  @Input() searchPlaceholder = 'Search Items..';

  /** Custom text when we don't have results */
  @Input() noItemsLabel = 'No items found';

  /** Add/removes search input */
  @Input() isCombo = true;

  /** Wheteher is group */
  @Input() isGroup = false;

  /**
   * Decide whether to filter the results internally based on search query.
   * Useful for async filtering, where we search through more complex data.
   * @type {boolean}
   */
  @Input() internalSearch = true;

  /** Debounce time to emit search queries */
  @Input() debounceTime = 300;

  /** Whether to show loading indicator */
  @Input() isLoading = false;

  /** Whether to allow select all checkbox */
  @Input() allowSelectAll = false;

  /** The type of the select */
  @Input() type: SelectType = SelectType.SINGLE;

  /** Client search strategy */
  @Input() searchStrategy: DatoSelectSearchStrategy = defaultClientSearchStrategy;

  /** The default position of thh dropdown */
  @Input() placement: Placement = 'bottom-start';

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

  /** Emit search value when internal search is false */
  @Output() search = new EventEmitter<string>();

  /** Emit when [withActions] is true and the user clicks save */
  @Output() save = new EventEmitter<string>();

  /**
   * Getters and Setters
   */

  get data() {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  get open() {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
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

  get isSingle() {
    return this.type === SelectType.SINGLE;
  }

  get isMulti() {
    return this.type === SelectType.MULTI;
  }

  get _showEmptyResults() {
    return (!this.hasResults || !this._data.length) && !this.isGroup;
  }

  get _count() {
    const total = this.options.length;
    const actives = this._model.length;
    return `(${actives}/${total})`;
  }

  /** Whether all the options are checked */
  get _isAllChecked() {
    return this.options.length === this._model.length;
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

  /** Triggers the focus on the input */
  _focus = false;

  /** Store the actives options */
  _model = [];

  /** Enable/disable the select-trigger */
  _disabled;

  /** Wheter the dropdown is open */
  _open = false;

  /** Whether we have search result */
  _hasResults = true;

  /** Indication if we need to set the initial control value as actives */
  _initialOpen = true;

  /** Whether generate cancel/save footer */
  _withActions = false;

  /** Notify the multi trigger when click outside to remove the focus  */
  _clickOutside = false;

  /** Dropdown size class */
  _dropdownClass;

  /** Search control subscription */
  private searchSubscription;

  /** Clicks options subscription */
  private clicksSubscription;

  /** Keyboard Manager */
  private keyboardEventsManager: ListKeyManager<DatoSelectOptionComponent>;

  /** Keyboard subscription */
  private keyboardEventsManagerSubscription;

  /** Current index of active item (keyboard navigation) */
  private currentIndex;

  constructor(private cdr: ChangeDetectorRef, private host: ElementRef, private datoOverlay: DatoOverlay, @Attribute('datoSize') public size) {
    super();
    this.size = size || 'md';
    this._dropdownClass = `dato-select-${this.size}`;
  }

  ngOnInit() {
    this._withActions = this.save.observers.length === 1;
    this.listenToSearch();
  }

  /**
   * Close the dropdown
   */
  close() {
    this.searchControl.patchValue('');
    this.datoOverlay.detach();
    this.toggle();
    this._focus = false;
  }

  /**
   * Toggle the dropdown visibility
   */
  toggle() {
    this.open = !this.open;
    if (this.open && this.isCombo) {
      this._focus = true;
      this._clickOutside = false;
    }

    this.cdr.markForCheck();
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
    /** For later updates */
    this.cdr.markForCheck();
  }

  /**
   * Open the overlay
   */
  openDropdown() {
    /** Close the dropdown when we click on the trigger and we don't have search or multiple */
    if (this.open && !this.isCombo && this.isSingle) {
      this.close();
      return;
    }

    /** Don't close the dropdown if we click on the input and it's open */
    if (this.open && this.isCombo) return;

    if (!this.datoOverlay.created) {
      const templatePortal = new DatoTemplatePortal(this.dropdown);
      this.datoOverlay.create(this.origin.nativeElement, templatePortal);
    }

    this.datoOverlay.backDropClick$.pipe(take(1)).subscribe(() => {
      this._clickOutside = true;
      this.open && this.close();
    });

    this.datoOverlay.attach(this.getPopperOptions(), this._dropdownClass);

    this.toggle();

    /**
     * When we first open the dropdown we need to mark the
     * FormControl values as actives
     */
    if (this.hasValue && this._initialOpen) {
      this.markAsActive(this._model);
      this._initialOpen = false;
    }

    this.dropdownFocus();
  }

  ngAfterContentInit(): void {
    this.subscribeToOptionClick(this.options);
    this.keyboardEventsManager = new ListKeyManager(this.options).withWrap().withVerticalOrientation(true);
    this.keyboardEventsManagerSubscription = this.keyboardEventsManager.change.subscribe(index => {
      const options = this.options.toArray();
      options.forEach(datoOption => (datoOption.activeByKeyboard = false));
      options[index].activeByKeyboard = true;
      this.scrollToElement(index);
    });
  }

  /**
   *
   * @param {boolean} checked
   */
  checkAll(checked: boolean) {
    this.options.forEach(datoOption => (datoOption.active = checked));
    const model = checked ? this.getRawOptions() : [];
    this._model = model;
    this.onChange(model);
  }

  /**
   *
   * @param option
   */
  removeOption(option) {
    this._model = this._model.filter(current => current[this.idKey] !== option[this.idKey]);
    this.options.find(datoOption => datoOption.option[this.idKey] === option[this.idKey]).active = false;
    this.onChange(this._model);
    this.cdr.markForCheck();
    this.datoOverlay.scheduleUpdate();
  }

  /**
   *
   * @returns {any[]}
   */
  private getRawOptions() {
    return this.options.map(datoOption => datoOption.option);
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
   * Show all options
   */
  private showAll() {
    for (let datoOption of this.options.toArray()) {
      datoOption.hideAndDisabled(false);
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
    this.searchSubscription =
      this.isCombo &&
      this.searchControl.valueChanges.pipe(debounceTime(this.debounceTime)).subscribe(value => {
        if (this.internalSearch) {
          if (this.isEmpty(value)) {
            this.showAll();
            this.hasResults = true;
          } else {
            this.hasResults = this.searchOptions(value);
          }
        } else {
          this.search.emit(value);
        }

        this.keyboardEventsManager.setActiveItem(0);

        this.cdr.markForCheck();
      });
  }

  /**
   * Subscribe to option click and change the state accordingly
   * @param {DatoSelectOptionComponent[]} options
   */
  private subscribeToOptionClick(options: QueryList<DatoSelectOptionComponent>) {
    this.clicksSubscription && this.clicksSubscription.unsubscribe();

    /** Gather all the clicks */
    const clicks$ = options.map(option => option.click$.pipe(mapTo(option)));

    /** Consider change it to use event delegation */
    this.clicksSubscription = merge(...clicks$)
      .pipe(debounceTime(10))
      .subscribe((datoOption: DatoSelectOptionComponent) => {
        if (datoOption.disabled) return;
        this.isSingle ? this.handleSingleClick(datoOption) : this.handleMultiClick(datoOption);
      });
  }

  /**
   *
   * @param {number} keyCode
   */
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown({ keyCode }: KeyboardEvent) {
    if (keyCode === ESCAPE && this.open) {
      this.close();
    }
  }

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
      this.isSingle ? this.handleSingleClick(active) : this.handleMultiClick(active);
      return false;
    }
  }

  /**
   *
   * @param {DatoSelectOptionComponent} datoOption
   */
  private handleSingleClick(datoOption: DatoSelectOptionComponent) {
    if (datoOption.active) {
      this.close();
    } else {
      this.options.forEach(datoOption => (datoOption.active = false));
      datoOption.active = true;
    }

    const rawOption = datoOption.option;
    this._model = [rawOption];
    this.onChange(rawOption);
    this.close();
  }

  /**
   *
   * @param {DatoSelectOptionComponent} datoOption
   */
  private handleMultiClick(datoOption: DatoSelectOptionComponent) {
    datoOption.active = !datoOption.active;
    const rawOption = datoOption.option;
    if (datoOption.active) {
      this._model = this._model.concat(rawOption);
    } else {
      this._model = this._model.filter(current => current[this.idKey] !== rawOption[this.idKey]);
    }
    this.onChange(this._model);
    this.cdr.markForCheck();
    this.datoOverlay.scheduleUpdate();
  }

  /**
   *
   * @param {number} index
   */
  private scrollToElement(index: number) {
    const dropdown = query('.dato-select__dropdown');
    if (!dropdown) return;

    const NUM_ITEMS = 4;
    let scrollTop = dropdown.scrollTop;
    const LAST = this.options.filter(datoOption => !datoOption.disabled).length;

    if (index === LAST) {
      scrollTop = dropdown.scrollHeight;
    } else {
      if (index < NUM_ITEMS) {
        scrollTop = 0;
      } else {
        const optionHeight = getSelectOptionHeight(this.type, this.size);
        if (this.currentIndex > index) {
          scrollTop = dropdown.scrollTop - optionHeight;
        } else {
          scrollTop = optionHeight + dropdown.scrollTop;
        }
      }
    }

    dropdown.scrollTop = scrollTop;
    this.currentIndex = index;
  }

  /**
   *
   * @returns {Partial<PopperOptions>}
   */
  private getPopperOptions(): Partial<PopperOptions> {
    return {
      placement: this.placement,
      modifiers: {
        preventOverflow: { enabled: false },
        applyStyle: {
          onLoad: (origin: HTMLElement, dropdown: HTMLElement) => {
            const { width } = origin.getBoundingClientRect();
            setStyle(dropdown, 'width', `${width}px`);
          }
        }
      }
    };
  }

  /**
   * Focus dropdown
   */
  private dropdownFocus() {
    const container = query('.dato-select__dropdown-container') as HTMLElement;
    if (container) container.focus();
    this.keyboardEventsManager.setActiveItem(0);
  }

  ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.clicksSubscription && this.clicksSubscription.unsubscribe();
    this.keyboardEventsManagerSubscription && this.keyboardEventsManagerSubscription.unsubscribe();
    this.datoOverlay.attached && this.datoOverlay.destroy();
  }
}
