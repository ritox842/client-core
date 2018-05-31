/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { ConnectedPositionStrategy, Overlay, OverlayConfig, OverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DatoSelectActiveDirective } from './select-active.directive';
import { coerceArray } from '@datorama/utils';
import { SelectType } from './select.types';
import { DatoSelectOptionComponent } from './select-option.component';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, mapTo } from 'rxjs/operators';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoSelectComponent),
  multi: true
};

@Component({
  selector: 'dato-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [valueAccessor],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'datoSelect'
})
export class DatoSelectComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {
  /** The dropdown container element which is the portal  **/
  @ViewChild('dropdown') dropdown: TemplateRef<any>;

  /** The overlay origin which is one of dato-triggers **/
  @ViewChild(OverlayOrigin) origin: OverlayOrigin;

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

  /** The type of the select */
  @Input() type: SelectType = SelectType.SINGLE;

  /** The options to display in the dropdown */
  @Input()
  set dataSet(data: any[]) {
    this._data = data;

    /** If it's async updates, create micro task in order to re-subscrive to clicks */
    if (this._dataIsDirty) {
      Promise.resolve().then(() => this.subscribeToOptionClick(this.options));
    }

    this._dataIsDirty = true;
  }

  @Output() search = new EventEmitter<string>();

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

  get isAutoComplete() {
    return this.type === SelectType.AUTO_COMPLETE;
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

  /** Reference to the overlay*/
  _overlayRef: OverlayRef;

  /** Search control subscription */
  _searchSubscription;

  /** Clicks options subscription */
  _clicksSubscription;

  /** Whether we have search result */
  _hasResults = true;

  /** Indication if we need to set the initial control value as actives */
  _initialOpen = true;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.listenToSearch();
  }

  /**
   * Close the dropdown
   */
  close() {
    this.searchControl.patchValue('');
    this._overlayRef && this._overlayRef.dispose();
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

    const { width } = (this.origin.elementRef.nativeElement as HTMLElement).getBoundingClientRect();

    const config = this.getOverlayConfig(width, this.getOverlayPosition(this.origin));
    this._overlayRef = this.overlay.create(config);
    this._overlayRef.attach(new TemplatePortal(this.dropdown, this.viewContainerRef));

    this.toggle();

    if (this.hasValue && this._initialOpen) {
      this.markAsActive(this._model);
      this._initialOpen = false;
    }
  }

  ngAfterContentInit(): void {
    this.subscribeToOptionClick(this.options);
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
      datoOption.hide = false;
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
      const match = datoOption.option[this.labelKey].toLowerCase().indexOf(value) > -1;

      if (!match) {
        datoOption.hide = true;
      } else {
        datoOption.hide = false;
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
    this._searchSubscription =
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
      });
  }

  /**
   * Subscribe to option click and change the state accordingly
   * @param {DatoSelectOptionComponent[]} options
   */
  private subscribeToOptionClick(options: QueryList<DatoSelectOptionComponent>) {
    this._clicksSubscription && this._clicksSubscription.unsubscribe();

    /** Gather all the clicks */
    const clicks$ = options.map(option => option.click$.pipe(mapTo(option)));

    this._clicksSubscription = merge(...clicks$).subscribe((datoOption: DatoSelectOptionComponent) => {
      if (datoOption.disabled) return;

      if (datoOption.active) {
        this.close();
        return;
      }

      this.options.forEach(datoOption => (datoOption.active = false));
      datoOption.active = true;
      this.select(datoOption);
    });
  }

  /**
   *
   * @param {DatoSelectOptionComponent} option
   */
  private select({ option }: DatoSelectOptionComponent) {
    if (this.isSingle) {
      this._model = [option];
      this.onChange(option);
    }
    this.close();
  }

  /**
   *
   * @param origin
   * @returns {ConnectedPositionStrategy}
   */
  private getOverlayPosition(origin) {
    return this.overlay.position().connectedTo(
      origin.elementRef,
      {
        originX: 'start',
        originY: 'bottom'
      },
      { overlayX: 'start', overlayY: 'top' }
    );
  }

  /**
   *
   * @param width
   * @param positionStrategy
   * @returns {OverlayConfig}
   */
  private getOverlayConfig(width: number, positionStrategy: ConnectedPositionStrategy) {
    return new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width,
      hasBackdrop: false,
      backdropClass: 'dato-select',
      panelClass: 'dato-select'
    });
  }

  ngOnDestroy() {
    this._searchSubscription && this._searchSubscription.unsubscribe();
    this._clicksSubscription && this._clicksSubscription.unsubscribe();
  }
}
