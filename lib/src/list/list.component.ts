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
import { getListOptionHeight } from './list-size';
import { DatoListSearchStrategy, defaultClientSearchStrategy } from './search.strategy';
import { normalizeData } from '../internal/data-normalization';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { DatoListSortComparator, defaultClientSortComparator } from './sort.comparator';
import { delay } from 'helpful-decorators';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoListComponent),
  multi: true
};

export type ListGroupComponent = DatoAccordionGroupComponent | DatoGroupComponent;

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

  private isSearching = false;

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService, private host: ElementRef) {
    super();
  }

  ngOnInit() {
    this.listenToSearch();
    this._data = this.normalizeData(this._data);
    this.initialRun = false;
  }

  /**
   * A public helper function for trackBy.
   * This is in use by the developer.
   * @param index
   * @param option
   * @return {any}
   */
  trackByFn(index, option) {
    return option ? option[this.idKey] : index;
  }

  ngAfterContentInit(): void {
    /* Subscribing to options change, and re-init the options.
     * This is needed only for the accordion, cause his children are not on the DOM yet
     */
    if (this.isAccordionGroup()) {
      this.options.changes.pipe(untilDestroyed(this)).subscribe(_ => this.initOptions());
    }

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
      // first level sorting
      data.sort((a, b) => {
        return this.sortComparator(a[this.labelKey], b[this.labelKey], searchTerm);
      });

      // second level sorting
      data.forEach(node => {
        if (node.children) {
          this._sort(node.children);
        }
      });
    }

    return data;
  }

  /**
   * Whether the group component is Accordion
   * @return {number}
   */
  private isAccordionGroup() {
    return this.accordion.length;
  }

  /**
   * Retrieve an array of the group components
   * @return {ListGroupComponent[]}
   */
  private getGroupComponentsArray(): ListGroupComponent[] {
    return this.isAccordionGroup() ? this.accordion.first.groups.toArray() : this.groups.toArray();
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
    this.searchControl.valueChanges.pipe(debounceTime(this.debounceTime), untilDestroyed(this)).subscribe((value: string) => {
      if (this.isEmpty(value)) {
        this.isSearching = false;
        //this._hasSearchResults = false;

        const isAccordion = this.isAccordionGroup();
        this.getGroupComponentsArray().forEach((groupComponent: ListGroupComponent) => {
          groupComponent._hidden = false;

          if (isAccordion) {
            const anyGroup = groupComponent as any;
            if (anyGroup.__expended) {
              anyGroup.__expended = false;
              (anyGroup as DatoAccordionGroupComponent).expand(false);
            }
          }
        });
      } else {
        const result = this.search(value);
        this._searchData = this._sort(result.results);
        this._hasSearchResults = result.hasResults;
        this.isSearching = true;
      }

      /* due to the sorting behaviour when searching, we need to sort again */
      //this.data = this._sort(data);

      this.cdr.markForCheck();

      /* selecting the first item on the next tick */
      setTimeout(() => {
        this.keyboardEventsManager.setActiveItem(0);
      });
    });
  }

  /**
   * Mark the initial control value as active
   * @param model
   */
  private markAsActive(model: any[]) {
    for (const option of model) {
      const match = this.options.find(opt => opt.option[this.idKey] === option[this.idKey]);
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
   * Search for matching results
   * @param {string} searchTerm
   * @returns {boolean}
   */
  private search(searchTerm: string): { results: any[]; hasResults: boolean } {
    const groupComponentsArray = this.getGroupComponentsArray();
    const isAccordion = this.isAccordionGroup();

    let hasResults = false;
    const results = this._data.reduce((previousValue, currValue, currentIndex) => {
      /* Filter Groups */
      if (groupComponentsArray.length) {
        const children = currValue.children;
        const group = { ...{}, ...currValue, children: [] };
        let showGroup = false;

        /* Add the entire group */
        previousValue.push(group);

        if (this.searchGroupLabels && this.searchStrategy(currValue, searchTerm, this.labelKey)) {
          showGroup = true;
          group.children = children;
        } else {
          group.children = children.filter(option => {
            return this.searchStrategy(option, searchTerm, this.labelKey);
          });

          if (group.children.length) {
            showGroup = true;
          }
        }

        const groupComponent = groupComponentsArray[currentIndex];

        groupComponent._hidden = !showGroup;
        if (showGroup) {
          hasResults = true;
        }

        if (isAccordion && showGroup && !(groupComponent as DatoAccordionGroupComponent).content._expanded) {
          /* Expend the accordion */
          (groupComponent as DatoAccordionGroupComponent).expand(true);
          /* Mark the accordion as expended, so we can return to the default state later */
          (groupComponent as any).__expended = true;
        }
      } else {
        /* Filter Flat List */
        const matchOption = this.searchStrategy(currValue, searchTerm, this.labelKey);
        if (matchOption) {
          previousValue.push(currValue);
          hasResults = true;
        }
      }

      return previousValue;
    }, []);

    return { results, hasResults };
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
