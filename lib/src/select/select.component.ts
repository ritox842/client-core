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
import { coerceArray, size } from '@datorama/utils';
import { defaultOptionsDisplayLimit, SelectType } from './select.types';
import { DatoOptionComponent } from '../options/option.component';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, mapTo, take } from 'rxjs/operators';
import { DatoSelectActiveDirective } from './select-active.directive';
import { DatoSelectSearchStrategy, defaultClientSearchStrategy } from './search.strategy';
import { Placement, PopperOptions } from 'popper.js';
import { addClass, query, setStyle } from '../internal/helpers';
import { DatoOverlay, DatoTemplatePortal } from '../angular/overlay';
import { ListKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { getSelectOptionHeight } from './select-size';
import { DatoTranslateService } from '../services/translate.service';
import { zIndex } from '../internal/z-index';
import { normalizeData } from '../internal/data-normalization';
import { DatoAccordionComponent, DatoAccordionGroupComponent } from '../accordion/public_api';
import { DatoGroupComponent } from '../options/group.component';
import { ListGroupComponent, ListSearchResult } from '../list/list.types';

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
export class DatoSelectComponent extends BaseCustomControl implements OnInit, ControlValueAccessor, AfterContentInit {
  /** The dropdown container element which is the portal  **/
  @ViewChild('dropdown')
  dropdown: TemplateRef<any>;

  /** The overlay origin which is one of dato-triggers **/
  @ViewChild('overlayOrigin')
  origin: ElementRef;

  /** QueryList of datoOptions children */
  @ContentChildren(DatoOptionComponent, { descendants: true })
  options: QueryList<DatoOptionComponent>;

  /** QueryList of datoAccordionGroups children */
  @ContentChildren(forwardRef(() => DatoAccordionComponent), { descendants: true })
  accordion: QueryList<DatoAccordionComponent>;

  /** QueryList of datoGroups children */
  @ContentChildren(DatoGroupComponent)
  groups: QueryList<DatoGroupComponent>;

  /** Allowing custom template by passing *datoActive directive which gets the active as context */
  @ContentChild(DatoSelectActiveDirective)
  active: DatoSelectActiveDirective;

  /** The key that stores the option id */
  @Input()
  idKey = 'id';

  /** The lookup key for the label */
  @Input()
  labelKey = 'label';

  /** A placeholder for the trigger */
  @Input()
  set placeholder(value: string) {
    this._placeholder = this.translate.transform(value);
  }

  /** A placeholder for the search */
  @Input()
  set searchPlaceholder(value: string) {
    this._searchPlaceholder = this.translate.transform(value);
  }

  /** Custom text when we don't have results */
  @Input()
  set noItemsLabel(value: string) {
    this._noItemsLabel = this.translate.transform(value);
  }

  /** If defined, indicates by which key the data should be normalized */
  @Input()
  groupBy: string;

  /** Add/removes search input */
  @Input()
  isCombo = true;

  /** Wheteher it's a group */
  @Input()
  isGroup = false;

  /**
   * Decide whether to filter the results internally based on search query.
   * Useful for async filtering, where we search through more complex data.
   * @type {boolean}
   */
  @Input()
  internalSearch = true;

  /** Debounce time to emit search queries */
  @Input()
  debounceTime = 300;

  /** Whether to show loading indicator */
  @Input()
  isLoading = false;

  /** Whether to allow select all checkbox */
  @Input()
  allowSelectAll = false;

  /** The type of the select */
  @Input()
  type: SelectType = SelectType.SINGLE;

  /** Client search strategy */
  @Input()
  searchStrategy: DatoSelectSearchStrategy = defaultClientSearchStrategy;

  /** The default position of the dropdown */
  @Input()
  placement: Placement = 'bottom-start';

  @Input()
  infiniteScrollLoading = false;

  @Input()
  limitTo = defaultOptionsDisplayLimit;

  /** The options to display in the dropdown */
  @Input()
  set dataSet(data: any[]) {
    if (!this.initialRun) {
      this._data = normalizeData(data, this.labelKey, this.groupBy);
    } else {
      /** data normalization, if required, will be handled by ngOnInit in the initial run */
      this._data = data;
    }

    /** If it's async updates, create micro task in order to re-subscribe to clicks */
    if (this._dataIsDirty) {
      Promise.resolve().then(() => {
        this.subscribeToOptionClick(this.options);
        this.markAsActive(this._model);
      });
    }

    this._dataIsDirty = true;
  }

  /** Search groups as well as options */
  @Input()
  searchGroupLabels = true;

  /** Emit search value when internal search is false */
  @Output()
  search = new EventEmitter<string>();

  /** Emit when [withActions] is true and the user clicks save */
  @Output()
  save = new EventEmitter<void>();

  @Output()
  fetch = new EventEmitter<boolean>();

  @Output()
  blur = new EventEmitter<void>();

  /**
   * Getters and Setters
   */

  get data() {
    return this._data;
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
    return this._data && (!this.hasResults || !this._data.length) && !this.isGroup;
  }

  get _count() {
    const total = this.options.length;
    const actives = this._model.length;
    return `(${actives}/${total})`;
  }

  /** Whether all the options are checked */
  get _isAllChecked() {
    return this.getVisibleOptions().every(option => this._model.indexOf(option) > -1);
  }

  /** FormControl which listens for search value changes */
  searchControl = new FormControl();

  /**
   * Private Properties
   */

  _placeholder = this.translate.transform('general.select');

  _searchPlaceholder = this.translate.transform('general.search');

  _noItemsLabel = this.translate.transform('general.no-items');

  /** Store the initial data */
  _data = [];

  /** Indicates whether we already initialized the data,
   *  This is optimization for non async calls.
   * */
  _dataIsDirty = false;

  /** Triggers the focus on the input */
  _focus = false;

  /** Store the active options */
  _model = [];

  /** Enable/disable the select-trigger */
  _disabled;

  /** Wheter the dropdown is open */
  _open = false;

  /** Whether we have search results */
  _hasResults = true;

  /** Indication if we need to set the initial control value as actives */
  _initialOpen = true;

  /** Whether generate cancel/save footer */
  _withActions = false;

  _withInfiniteScroll = false;

  /** Notify the multi trigger when click outside to remove the focus  */
  _clickOutside = false;

  /** Dropdown size class */
  _dropdownClass;

  /** Whether is selectAll checked */
  _checked;

  /*Holds all disabled options ID's**/
  disabledIDs: string | number[];

  /** true until ngOnInit */
  private initialRun = true;

  /** Search control subscription */
  private searchSubscription;

  /** Clicks options subscription */
  private clicksSubscription;

  /** Keyboard Manager */
  private keyboardEventsManager: ListKeyManager<DatoOptionComponent>;

  /** Keyboard subscription */
  private keyboardEventsManagerSubscription;

  private infiniteSubscription;

  /** Current index of active item (keyboard navigation) */
  private currentIndex;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService, private host: ElementRef<HTMLElement>, private datoOverlay: DatoOverlay, @Attribute('naked') public _naked, @Attribute('datoSize') public size, @Attribute('datoSelectClass') klass) {
    super();
    this.size = size || 'md';
    this._dropdownClass = [`dato-select-${this.size}`];
    if (klass) {
      this._dropdownClass.push(klass);
    }
  }

  ngOnInit() {
    this._withActions = this.save.observers.length === 1;
    this._withInfiniteScroll = this.fetch.observers.length === 1;
    this.listenToSearch();
    this._data = normalizeData(this._data, this.labelKey, this.groupBy);
    this.initialRun = false;
  }

  /**
   * Close the dropdown
   */
  close() {
    this.searchControl.patchValue('');
    this.datoOverlay.detach();
    this.toggle();
    this._focus = false;
    this._clickOutside = true;
    this.infiniteSubscription && this.infiniteSubscription.unsubscribe();
    this.blur.emit();
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
    if (this.options) {
      this.markAsActive(this._model, { deselectAll: true });
    }
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

    if (this._withInfiniteScroll) {
      this.activateInfiniteScroll();
    }

    setStyle(query('.dato-overlay'), 'zIndex', zIndex.select.toString());
    setStyle(query('.dato-select__dropdown-container'), 'width', `${this.host.nativeElement.getBoundingClientRect().width}px`);
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
    this.setDisabledIDs();
  }

  /**
   *
   * @param {boolean} checked
   */
  checkAll(checked: boolean) {
    for (const datoOption of this.options.toArray()) {
      if (!datoOption.disabled) {
        datoOption.active = checked;
      }
    }

    const visibleOptions = this.getVisibleOptions();
    const isAllVisible = visibleOptions.length === this.options.length;

    if (isAllVisible) {
      this._model = checked ? visibleOptions : [];
    } else {
      if (checked) {
        const temp = [];
        for (const option of visibleOptions) {
          if (this._model.indexOf(option) === -1) {
            temp.push(option);
          }
        }
        this._model = [...this._model, ...temp];
      } else {
        this._model = this._model.filter(option => visibleOptions.indexOf(option) === -1);
      }
    }

    this.onChange(this._model);
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
    if (this.datoOverlay.attached) {
      this.datoOverlay.scheduleUpdate();
    }
  }

  /**
   *
   * @returns {any[]}
   */
  private getVisibleOptions(getRawOptions = true) {
    const options = this.options.filter(datoOption => !datoOption.disabled);
    if (getRawOptions) {
      return options.map(datoOption => datoOption.option);
    }
    return options;
  }

  /**
   * Mark the initial control value as active
   * @param model
   */
  private markAsActive(model: any[], options: { deselectAll: boolean } = { deselectAll: false }) {
    const asArray = this.options.toArray();
    if (options.deselectAll) {
      this.resetAll();
    }
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
    const isAccordion = this.isAccordionGroup();
    const groupComponents: ListGroupComponent[] = this.getGroupComponentsArray();

    for (const groupComponent of groupComponents) {
      groupComponent._hidden = false;

      /* If this accordion group has been expended by the search function,
         then collapse it to the original state
      */
      if (isAccordion) {
        const anyGroup = groupComponent as any;

        if (anyGroup.__expended) {
          anyGroup.__expended = false;
          const accordionGroup = anyGroup as DatoAccordionGroupComponent;
          accordionGroup.content.disableAnimation = false;
          accordionGroup.expand(false);
        }
      }
    }

    for (const datoOption of this.options.toArray()) {
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
    const groupComponentsArray: ListGroupComponent[] = this.getGroupComponentsArray();
    const hasGroups = groupComponentsArray.length;

    if (hasGroups) {
      hasResult = this.searchInGroups(groupComponentsArray, value);
    } else {
      hasResult = this.searchInOptions(value);
    }

    return hasResult;
  }

  /**
   * Search for matching groups and children.
   * @param {ListGroupComponent[]} groupComponentsArray
   * @param {string} value
   * @return {boolean}
   */
  private searchInGroups(groupComponentsArray: ListGroupComponent[], value: string): boolean {
    const isAccordion = this.isAccordionGroup();
    const dataLength = this._data.length;
    let hasResults = false;

    for (let i = 0; i < dataLength; i++) {
      const group = this._data[i];
      const groupKey = this.getGroupKey(group);
      const groupMatch = this.searchGroupLabels && this.searchStrategy(group, value, this.labelKey);
      const groupOptions = group.children.map(child => child[this.labelKey]);
      /* show/hide the options */
      const showGroup = this.searchInOptions(value, groupOptions, groupMatch);

      if (showGroup && !hasResults) {
        hasResults = true;
      }

      /* Find the right component, according to the internal key assigned in the previous search.
         When no match is found, falling back to the same index as the group option.
      *  The index is considered less safe, because it can change after sorting. */
      const groupComponent = groupComponentsArray.find((g: any) => g.__key === groupKey) || groupComponentsArray[i];
      /* Show/hide the group */
      if (groupComponent) {
        groupComponent._hidden = !showGroup;
        /* assign an internal key to the component instance, so we can find it later (above). */
        (groupComponent as any).__key = groupKey;
        /* Expand the accordion on matching results */
        if (isAccordion && showGroup) {
          const accordionGroup = groupComponent as DatoAccordionGroupComponent;

          if (!accordionGroup.expanded) {
            accordionGroup.content.disableAnimation = true;
            /* Expand the accordion */
            accordionGroup.expand(true);
            /* Mark the accordion as expanded, so we can return to the default state later */
            (groupComponent as any).__expended = true;
          }
        }
      }
    }

    return hasResults;
  }

  /**
   * Search the options to show or hide each and return if result has been found.
   * Consider we have a group that match we show all of its options.
   * @param {string} value
   * @param groupOptions
   * @param groupMatch
   */
  private searchInOptions(value: string, groupOptions = [], groupMatch = false) {
    let hasResults = false;

    for (const datoOption of this.options.toArray()) {
      const optionInGroup = groupOptions.indexOf(datoOption.option[this.labelKey]) !== -1;

      if (groupMatch && optionInGroup) {
        datoOption.hideAndDisabled(false);
        hasResults = true;
      } else if (!size(groupOptions) || optionInGroup) {
        const match = this.searchStrategy(datoOption, value, this.labelKey);

        if (!match) {
          datoOption.hideAndDisabled(true);
        } else {
          datoOption.hideAndDisabled(false);
          hasResults = true;
        }
      }
    }

    return hasResults;
  }

  /**
   * Get the key of the option group. It can be the group Id if exists, or the label.
   * @param option
   * @return {any}
   */
  private getGroupKey(option) {
    return option && (option[this.idKey] || option[this.labelKey]);
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
        this.datoOverlay && this.datoOverlay.scheduleUpdate();
      });
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
        this.isSingle ? this.handleSingleClick(datoOption) : this.handleMultiClick(datoOption);
      });
  }

  /**
   *
   * @param {number} keyCode
   */
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE && this.open) {
      this._clickOutside = true;
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

  private resetAll() {
    for (const datoOption of this.options.toArray()) {
      datoOption.active = false;
    }
  }

  /**
   *
   * @param {DatoOptionComponent} datoOption
   */
  private handleSingleClick(datoOption: DatoOptionComponent) {
    if (datoOption.active) {
      this.close();
      return;
    } else {
      this.resetAll();
      datoOption.active = true;
    }

    const rawOption = datoOption.option;
    this._model = [rawOption];
    this.onChange(rawOption);
    this.close();
  }

  /**
   *
   * @param {DatoOptionComponent} datoOption
   */
  private handleMultiClick(datoOption: DatoOptionComponent) {
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
        const optionHeight = getSelectOptionHeight(this.size);
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
        hide: { enabled: false },
        preventOverflow: { enabled: false }
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

  private activateInfiniteScroll() {
    this.infiniteSubscription = fromEvent(document.querySelector('.dato-select__dropdown'), 'scroll')
      .pipe(debounceTime(50))
      .subscribe(_ => {
        const container = document.querySelector('.dato-select__dropdown') as HTMLElement;
        const scrollY = container.scrollHeight - container.scrollTop;
        const height = container.offsetHeight;
        const offset = height - scrollY;
        if (offset == 0 || offset == 1) {
          this.fetch.emit(true);
        }
      });
  }

  private setDisabledIDs() {
    this.disabledIDs = this.options ? this.options._results.filter(multiOptionComponent => multiOptionComponent.disabled).map(multiOptionComponent => multiOptionComponent.option.id) : [];
  }

  /**
   * Whether the group component is Accordion
   * @return {number}
   */
  private isAccordionGroup() {
    return this.accordion && this.accordion.length;
  }

  /**
   * Retrieve an array of the group components
   * @return {ListGroupComponent[]}
   */
  private getGroupComponentsArray(): ListGroupComponent[] {
    return this.isAccordionGroup() ? this.accordion.first.groups.toArray() : this.groups && this.groups.toArray();
  }
}
