import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { DatoGridToolbarItemDirective } from './grid-toolbar-item.directive';
import { debounce, delay } from 'helpful-decorators';
import { DatoGridComponent } from '../grid/grid.component';
import { Events, GridApi, GridReadyEvent } from 'ag-grid';
import { first, takeUntil } from 'rxjs/operators';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import {
  RowSelectionType,
  showWhenFunc,
  ToolbarAction,
  ToolbarActionType,
  ToolbarArea
} from './grid-toolbar';
import { HashMap, isFunction } from '@datorama/utils';
import { DatoTranslateService } from '../../services/translate.service';

@TakeUntilDestroy()
@Component({
  selector: 'dato-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss']
})
export class DatoGridToolbarComponent implements OnInit, OnDestroy, AfterContentInit {
  private eventHandler;
  private areaActions: HashMap<ToolbarArea> = {
    [ToolbarActionType.Button]: ToolbarArea.Left,
    [ToolbarActionType.Add]: ToolbarArea.InternalArea,
    [ToolbarActionType.Copy]: ToolbarArea.PreservedArea,
    [ToolbarActionType.Edit]: ToolbarArea.PreservedArea,
    [ToolbarActionType.Delete]: ToolbarArea.PreservedArea,
    [ToolbarActionType.MenuItem]: ToolbarArea.Menu
  };

  private gridApi: GridApi;

  private selectedRowsCount = 0;

  destroyed$: Observable<boolean>;

  @Input() actions: ToolbarAction[] = [];

  @Input()
  set grid(grid: DatoGridComponent) {
    if (grid && !this.gridApi) {
      // get gridApi
      grid.gridReady
        .pipe(takeUntil(this.destroyed$), first())
        .subscribe((event: GridReadyEvent) => {
          this.gridApi = event.api;
          this.onGridReady();
        });
    }
  }

  get leftAreaItems() {
    return this.filteredItems[ToolbarArea.Left];
  }

  get preservedAreaItems() {
    return this.filteredItems[ToolbarArea.PreservedArea];
  }

  get internalAreaItems() {
    return this.filteredItems[ToolbarArea.InternalArea];
  }

  @ContentChildren(DatoGridToolbarItemDirective) items: QueryList<DatoGridToolbarItemDirective>;
  @ViewChildren(DatoGridToolbarItemDirective) actionItems: QueryList<DatoGridToolbarItemDirective>;
  @ViewChild('container') container: ElementRef;

  open = false;

  /**
   * Contains the custom elements
   * @type {any[]}
   */
  filteredItems: HashMap<DatoGridToolbarItemDirective[]> = {
    [ToolbarArea.Menu]: [],
    [ToolbarArea.Left]: [],
    [ToolbarArea.PreservedArea]: [],
    [ToolbarArea.InternalArea]: []
  };

  get itemTemplates() {
    return [...this.items.toArray(), ...this.actionItems.toArray()];
  }

  constructor(private cdr: ChangeDetectorRef, private translate: DatoTranslateService) {}

  ngOnInit() {
    this.translateActions();
  }

  /**
   * Translate the actions
   */
  translateActions() {
    this.actions = this.actions.map(action => {
      return {
        ...action,
        text: this.translate.transform(action.text)
      };
    });
  }

  /**
   *
   * @memberof DaGridToolbarComponent
   */
  ngAfterContentInit() {}

  /**
   *
   * @memberof DaGridToolbarComponent
   */
  @HostListener('window:resize')
  @debounce(300)
  resize() {
    this.gridApi.sizeColumnsToFit();
  }

  ngOnDestroy() {
    // @TakeUntilDestroy()
    this.gridApi &&
      this.gridApi.removeEventListener(Events.EVENT_SELECTION_CHANGED, this.eventHandler);
  }

  actionClick(action: ToolbarAction) {
    if (action.click) {
      const selectedRows = this.gridApi.getSelectedRows();
      action.click(selectedRows);
    }
  }

  private onGridReady() {
    this.eventHandler = this.rowSelectionChange.bind(this);

    this.gridApi.addEventListener(Events.EVENT_SELECTION_CHANGED, this.eventHandler);

    this._filterItems(true);
    this.fitGridSizeOnInit();
  }

  private rowSelectionChange() {
    const rowData = this.gridApi.getSelectedRows();
    const rowsCount = rowData.length;
    this.open = false;

    if (this._shouldNotRerender(rowsCount)) {
      return;
    }

    this.selectedRowsCount = rowsCount;
    this._filterItems(false, rowsCount, rowData);
    this.cdr.detectChanges();
  }

  /**
   * Only rerender if we the rows count changed and we don't have a custom functions
   * @private
   * @param {number} rowsCount
   * @returns
   * @memberof DaGridToolbarComponent
   */
  private _shouldNotRerender(rowsCount: number) {
    return this.selectedRowsCount === rowsCount && !this._hasCustomFunctions();
  }

  /**
   *
   * @private
   * @returns
   * @memberof DaGridToolbarComponent
   */
  private _hasCustomFunctions() {
    return this.itemTemplates.filter(item => isFunction(item.showWhen)).length;
  }

  /**
   *
   * @private
   * @param {boolean} init
   * @param {number} [rowsCount]
   * @param {*} [data]
   * @returns
   * @memberof DaGridToolbarComponent
   */
  private _filterItems(init: boolean, rowsCount?: number, data?: any) {
    const initialItems: HashMap<DatoGridToolbarItemDirective[]> = {
      [ToolbarArea.Menu]: [],
      [ToolbarArea.Left]: [],
      [ToolbarArea.PreservedArea]: [],
      [ToolbarArea.InternalArea]: []
    };

    // 1. decide which items to show, based on their condition
    // 2. Group the items by their area
    this.filteredItems = this.itemTemplates
      .filter(item => {
        const condition = item.showWhen || 'always';
        if (isFunction(condition)) {
          return this._handleCustomFunction(condition, data);
        } else {
          return (
            this._isSingle(condition, rowsCount) ||
            this._isMultiple(condition, rowsCount) ||
            this._isNone(condition, rowsCount) ||
            this._showAlways(condition)
          );
        }
      })
      .sort((a, b) => {
        return a.order - b.order;
      })
      .reduce((previousValue, currentValue) => {
        // retrieve the item type. Default to custom
        const actionType = currentValue.actionType || ToolbarActionType.Button;
        // get the area we need to place this item
        const area: ToolbarArea = this.areaActions[actionType];
        previousValue[area].push(currentValue);

        return previousValue;
      }, initialItems);
  }

  /**
   *
   * @param condition
   * @returns {boolean}
   * @private
   */
  private _showAlways(condition) {
    return condition === RowSelectionType.ALWAYS;
  }

  /**
   *
   * @private
   * @param {(string | showWhenFunc)} condition
   * @param {any[]} selectedRows
   * @returns
   * @memberof DaGridToolbarComponent
   */
  private _handleCustomFunction(condition: string | showWhenFunc, selectedRows: any[]) {
    if (isFunction(condition)) {
      return (condition as Function)(selectedRows || []);
    }
    return false;
  }

  /**
   * Assert if only one row selected
   * @private
   * @param {(string | Function)} condition
   * @param {number} rowsCount
   * @returns
   * @memberof DaGridToolbarComponent
   */
  private _isSingle(condition: string | showWhenFunc, rowsCount: number) {
    return condition === RowSelectionType.SINGLE && rowsCount === 1;
  }

  /**
   * Assert if no rows selected.
   * @param {string | showWhenFunc} condition
   * @param {number | undefined} rowsCount
   * @return {boolean}
   * @private
   */
  private _isNone(condition: string | showWhenFunc, rowsCount: number | undefined) {
    return condition === RowSelectionType.NONE && !rowsCount;
  }

  /**
   *
   * @param {string | showWhenFunc} condition
   * @param {number} rowsCount
   * @returns {boolean}
   * @private
   */
  private _isMultiple(condition: string | showWhenFunc, rowsCount: number) {
    return condition === RowSelectionType.MULTI && rowsCount >= 1;
  }

  /**
   * For the grid to be responsive
   * @private
   * @memberof DaGridToolbarComponent
   */
  @delay()
  private fitGridSizeOnInit() {
    this.gridApi.sizeColumnsToFit();
  }
}
