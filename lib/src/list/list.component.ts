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
import { coerceArray } from '@datorama/utils';
import { debounceTime, mapTo } from 'rxjs/operators';
import { DatoOptionComponent } from '../options/option.component';
import { DatoGroupComponent } from '../options/group.component';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { ListKeyManager } from '@angular/cdk/a11y';
import { merge } from 'rxjs';
import { DatoAccordionComponent, DatoAccordionGroupComponent } from '../accordion/public_api';
import { query } from '../internal/helpers';
import { getListOptionHeight, ListGroupComponent, ListSearchResult } from './list.types';
import { DatoListSearchStrategy, defaultClientSearchStrategy } from './search.strategy';
import { normalizeData } from '../internal/data-normalization';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { DatoListSortComparator, defaultClientSortComparator, SORT_ORDER, SORT_SCORE } from './sort.comparator';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoListComponent),
  multi: true
};

@TakeUntilDestroy()
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
    if (!this.initialRun) {
      this._data = this.normalizeData(data);
    } else {
      /** data normalization, if required, will be handled by ngOnInit in the initial run */
      this._data = data;
    }

    /** If it's async updates, create micro task in order to re-subscribe to clicks */
    if (this._dataIsDirty) {
      Promise.resolve().then(() => {
        this.initOptions();
      });

      if (this.isSearching) {
        this.isSearching = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.performSearch();
        });
      }
    }

    this._dataIsDirty = true;
  }

  /** Debounce time to emit search queries */
  @Input() debounceTime = 300;

  /** If defined, indicates by which key the data should be normalized */
  @Input() groupBy: string;

  /** The key that stores the option id */
  @Input() idKey = 'id';

  /** Whether to show loading indicator */
  @Input() isLoading = false;

  /** The lookup key for the label */
  @Input() labelKey = 'label';

  /** Search groups as well as options */
  @Input() searchGroupLabels = true;

  /** Client search strategy */
  @Input() searchStrategy: DatoListSearchStrategy = defaultClientSearchStrategy;

  /** Client sort comparator */
  @Input() sortComparator: DatoListSortComparator = defaultClientSortComparator;

  /** Client sort */
  @Input() sort = true;

  /** available sizes */
  @Input() datoSize: 'sm' | 'md';

  /**
   * Getters and Setters
   */
  get data() {
    return this.isSearching ? this._searchData : this._data;
  }

  get hasSearchResults() {
    return !this.isSearching || this._hasSearchResults;
  }

  get hasResults() {
    return this.data.length > 0;
  }

  get hasValue() {
    return this._model.length;
  }

  get searchTerm() {
    return (this.searchControl.value || '').trim();
  }

  /** FormControl which listens for search value changes */
  searchControl = new FormControl();

  _searchPlaceholder = this.translate.transform('general.search');

  /**
   * Private Properties
   */

  /** Store the initial data */
  private _data = [];

  /** Store filtered data after performing a search */
  private _searchData = [];

  /** Indicates whether we already initialized the data,
   *  This is optimization for non async calls.
   * */
  private _dataIsDirty = false;

  /** Enable/disable the select-trigger */
  private _disabled;

  /** Whether we have search results */
  private _hasSearchResults = true;

  /** Store the active options */
  private _model = [];

  _listClass: string;

  /** Clicks options subscription */
  private clicksSubscription;

  /** Current index of active item (keyboard navigation) */
  private currentIndex;

  /** true until ngOnInit */
  private initialRun = true;

  /** Keyboard Manager */
  private keyboardEventsManager: ListKeyManager<DatoOptionComponent>;

  /** Keyboard subscription */
  private keyboardEventsManagerSubscription;

  /** Whether we're in a search mode */
  private isSearching = false;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService, private host: ElementRef) {
    super();
  }

  ngOnInit() {
    this.listenToSearch();

    this._data = this.normalizeData(this._data);
    this.initialRun = false;
    this.datoSize = this.datoSize || 'md';
    this._listClass = `list-${this.datoSize}`;
  }

  /**
   * A public helper function for trackBy.
   * This is in use by the developer.
   * @param index
   * @param option
   * @return {any}
   */
  private _trackByFn(index, option) {
    return this.getGroupKey(option) || index;
  }

  trackByFn = this._trackByFn.bind(this);

  ngAfterContentInit(): void {
    /* Subscribing to options change, and re-init the options */
    this.options.changes.pipe(untilDestroyed(this)).subscribe(_ => this.initOptions());

    this.keyboardEventsManager = new ListKeyManager(this.options).withWrap().withVerticalOrientation(true);
    this.keyboardEventsManagerSubscription = this.keyboardEventsManager.change.pipe(untilDestroyed(this)).subscribe(index => {
      const options = this.options.toArray();
      if (options.length) {
        options.forEach(datoOption => (datoOption.activeByKeyboard = false));
        options[index].activeByKeyboard = true;

        this.scrollToElement(index);
      }
    });

    this.subscribeToOptionClick(this.options);
  }

  ngOnDestroy() {
    /* @TakeUntilDestroy */
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

  /**
   * Subscribe to options click events and mark the relevant DatoOptions as active
   */
  private initOptions() {
    this.subscribeToOptionClick(this.options);
    this.markAsActive(this._model);
  }

  /**
   * Normalize a flatten and sorting a data set
   * @param data
   * @return {any[]}
   */
  private normalizeData(data) {
    return this._sort(normalizeData(data, this.labelKey, this.groupBy));
  }

  /**
   * Sort the groups and their children with the default comparator
   * @param {any[]} data
   * @return {any[]}
   * @private
   */
  private _sort(data: any[]): any[] {
    data = data || [];

    if (this.sort) {
      const searchTerm = this.searchTerm.toLowerCase();
      const groupScoreMap = {};

      /* Second level sorting - sorting the children of each group */
      data.forEach(node => {
        const children = node.children;
        const groupKey = this.getGroupKey(node);
        groupScoreMap[groupKey] = 0;

        if (children && children.length) {
          /* Sorting the items and updating the group's score */
          node.children.sort((a, b) => {
            const result = this.sortComparator(a[this.labelKey], b[this.labelKey], searchTerm);
            groupScoreMap[groupKey] += result[SORT_SCORE];

            return result[SORT_ORDER];
          });

          /* no sort is being made for one item, but we still need to calculate the scoring of this item */
          if (node.children.length === 1) {
            const itemLabel = node.children[0][this.labelKey];
            const result = this.sortComparator(itemLabel, itemLabel, searchTerm);
            groupScoreMap[groupKey] += result[SORT_SCORE];
          }
        }
      });

      /* First level sorting.
         First according to the group score, and then according to the given comparator
       */
      data.sort((a, b) => {
        if (searchTerm) {
          const aGroupKey = this.getGroupKey(a),
            bGroupKey = this.getGroupKey(b);

          if (groupScoreMap[aGroupKey] > groupScoreMap[bGroupKey]) {
            return -1;
          } else if (groupScoreMap[aGroupKey] < groupScoreMap[bGroupKey]) {
            return 1;
          }
        }

        return this.sortComparator(a[this.labelKey], b[this.labelKey], searchTerm)[SORT_ORDER];
      });
    }

    return data;
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
    return value.trim() === '';
  }

  /**
   * Subscribe to search changes and filter the list
   */
  private listenToSearch() {
    this.searchControl.valueChanges.pipe(debounceTime(this.debounceTime), untilDestroyed(this)).subscribe(_ => {
      this.performSearch();
    });
  }

  private performSearch() {
    const value = this.searchControl.value;

    if (this.isEmpty(value)) {
      this.isSearching = false;

      const isAccordion = this.isAccordionGroup();
      this._data = this._sort(this._data);
      const groupComponents: ListGroupComponent[] = this.getGroupComponentsArray();
      groupComponents.forEach((groupComponent: ListGroupComponent) => {
        groupComponent._hidden = false;

        /* If this accordion group has been expended by the search function,
           then collapse it to the original state
        */
        if (isAccordion) {
          const anyGroup = groupComponent as any;
          if (anyGroup.__expended) {
            anyGroup.__expended = false;
            (anyGroup as DatoAccordionGroupComponent).expand(false);
          }
        }
      });
    } else {
      const result: ListSearchResult = this.search(value);
      this._searchData = this._sort(result.results);
      this._hasSearchResults = result.hasResults;
      this.isSearching = true;
    }

    this.cdr.markForCheck();

    /* selecting the first item on the next tick */
    setTimeout(() => {
      this.keyboardEventsManager.setActiveItem(0);
    });
  }

  /**
   * Mark the initial control value as active
   * @param model
   */
  private markAsActive(model: any[]) {
    for (const option of this.options.toArray()) {
      const inModel = model.find(active => active[this.idKey] === option.option[this.idKey]);
      if (inModel) {
        option.active = true;
      } else {
        option.active = false;
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
   * Search for matching results
   * @param {string} searchTerm
   * @returns {boolean}
   */
  private search(searchTerm: string): ListSearchResult {
    const groupComponentsArray = this.getGroupComponentsArray();
    const hasGroups = groupComponentsArray.length;

    if (hasGroups) {
      return this.groupSearch(searchTerm);
    }

    const results = this._data.reduce((results, currValue) => {
      const matchOption = this.searchStrategy(currValue, searchTerm, this.labelKey);
      if (matchOption) {
        results.push(currValue);
      }

      return results;
    }, []);

    return { results, hasResults: results.length };
  }

  /**
   * Search for matcing groups and children.
   * @param {string} searchTerm
   * @return {ListSearchResult}
   */
  private groupSearch(searchTerm: string): ListSearchResult {
    const groupComponentsArray = this.getGroupComponentsArray();
    const isAccordion = this.isAccordionGroup();

    let hasResults = false;
    const results = this._data.reduce((results, currValue, currentIndex) => {
      const children = currValue.children;
      const group = { ...{}, ...currValue, children: [] };
      const groupKey = this.getGroupKey(group);

      let showGroup = false;

      /* Add the entire group */
      results.push(group);

      /* Match the whole group */
      if (this.searchGroupLabels && this.searchStrategy(currValue, searchTerm, this.labelKey)) {
        showGroup = true;
        group.children = children;
      } else {
        /* Add matching children */
        group.children = children.filter(option => {
          return this.searchStrategy(option, searchTerm, this.labelKey);
        });
        showGroup = group.children.length;
      }

      if (showGroup) {
        hasResults = true;
      }

      /* Find the right component, according to the internal key assigned in the previous search.
         When no match is found, falling back to the same index as the group option.
      *  The index is considered less safe, because it can change after sorting. */
      const groupComponent = groupComponentsArray.find((g: any) => g.__key === groupKey) || groupComponentsArray[currentIndex];

      /* Show/hide the group */
      if (groupComponent) {
        groupComponent._hidden = !showGroup;
        /* assign an internal key to the component instance, so we can find it later (above). */
        (groupComponent as any).__key = groupKey;

        /* Expand the accordion on matching results */
        if (isAccordion && showGroup) {
          const accordionGroup = groupComponent as DatoAccordionGroupComponent;
          if (!accordionGroup.expanded) {
            /* Expand the accordion */
            accordionGroup.expand(true);
            /* Mark the accordion as expanded, so we can return to the default state later */
            (groupComponent as any).__expended = true;
          }
        }
      }

      return results;
    }, []);

    return { results, hasResults };
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
   * Subscribe to option click and change the state accordingly
   * @param {DatoOptionComponent[]} options
   */
  private subscribeToOptionClick(options: QueryList<DatoOptionComponent>) {
    this.clicksSubscription && this.clicksSubscription.unsubscribe();

    /** Gather all the clicks */
    const clicks$ = options.map(option => option.click$.pipe(mapTo(option)));

    /** Consider change it to use event delegation */
    this.clicksSubscription = merge(...clicks$)
      .pipe(debounceTime(10), untilDestroyed(this))
      .subscribe((datoOption: DatoOptionComponent) => {
        if (datoOption.disabled) return;
        this.handleClick(datoOption);
      });
  }
}
