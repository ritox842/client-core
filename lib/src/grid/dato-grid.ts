/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ColDef, ColGroupDef, DetailGridInfo, GridApi, GridOptions, RowNode } from 'ag-grid';
import { coerceArray, getFunctionName, toBoolean } from '@datorama/utils';
import { ContentChild, OnInit, ViewChild } from '@angular/core';
import { ToolbarAction } from './grid-toolbar/grid-toolbar';
import { DatoGridComponent } from './grid/grid.component';
import { Subject } from 'rxjs/Subject';
import { getGridModel, setGridModel } from './grid-config';

export type GridColumns = (ColDef | ColGroupDef)[];

export abstract class DatoGrid<T> implements OnInit {
  @ViewChild(DatoGridComponent)
  set gridViewChild(gridComponent: DatoGridComponent) {
    this.initialGridReady(gridComponent);
  }

  @ContentChild(DatoGridComponent)
  set gridContentChild(gridComponent: DatoGridComponent) {
    this.initialGridReady(gridComponent);
  }

  options: GridOptions;
  toolbarActions: ToolbarAction[];
  datoGridReady = new Subject<DetailGridInfo>();

  private _gridApi: GridApi;
  private onFilterSortChangedBind;
  private gridName: string;

  get gridApi() {
    return this._gridApi;
  }

  set gridApi(gridApi) {
    this._gridApi = gridApi;
  }

  constructor() {
    this.onFilterSortChangedBind = this.onFilterSortChanged.bind(this);
    this.gridName = this.getGridName();
  }

  abstract getColumns(): GridColumns;

  abstract getToolbarActions(): ToolbarAction[];

  /**
   * @return the name of this grid component. The name used to store filters & sort configuration.
   */
  protected getGridName(): string {
    return getFunctionName(this.constructor);
  }

  ngOnInit() {
    this.options = { columnDefs: this.getColumns() };
    this.toolbarActions = this.getToolbarActions();
  }

  /**
   *
   * @returns {T}
   */
  getSelectedRows(onlyFirstRow: true): T & RowNode;
  getSelectedRows(onlyFirstRow?: false): T[] & RowNode[];
  getSelectedRows(onlyFirstRow: boolean): T[] & RowNode[] | T & RowNode;
  getSelectedRows(onlyFirstRow = false): T[] & RowNode[] | T & RowNode {
    const rows = this.gridApi.getSelectedRows();
    if (!onlyFirstRow) {
      return rows;
    }
    return rows.length ? rows[0] : null;
  }

  /**
   *
   * @param data
   */
  setRows(data: T[]) {
    this.gridApi.setRowData(data);
    this.gridApi.sizeColumnsToFit();
  }

  /**
   *
   * @param {T} row
   * @param {number} index
   * @returns {RowNodeTransaction}
   */
  addRows(row: T, index: number): any {
    const rows = coerceArray(row);
    let data: any = {
      add: rows
    };
    if (toBoolean(index)) {
      data.addIndex = index;
    }
    return this.gridApi.updateRowData(data);
  }

  /**
   *
   * @param {T[]} row
   * @returns {RowNodeTransaction}
   */
  updateRows(row: T[]): any {
    const rows = coerceArray(row);
    return this.gridApi.updateRowData({
      update: rows
    });
  }

  /**
   *
   * @param {string} id
   * @param {string} key
   * @param newValue
   */
  updateRowValue(id: string, key: string, newValue: any) {
    const rowNode = this.gridApi.getRowNode(id);
    rowNode.setDataValue(key, newValue);
  }

  /**
   *
   * @param {RowNode | RowNode[]} row
   * @returns {RowNodeTransaction}
   */
  removeRows(row: RowNode | RowNode[]): any {
    const rows = coerceArray(row);
    return this.gridApi.updateRowData({
      remove: rows
    });
  }

  /**
   *
   * @returns {RowNodeTransaction}
   */
  removeSelectedRows() {
    const selectedRows = this.getSelectedRows();
    return this.removeRows(selectedRows);
  }

  /**
   * Clear all the rows
   */
  clearTable() {
    this.setRows([]);
  }

  private removeEventListeners() {
    this.gridApi.removeEventListener('filterChanged', this.onFilterSortChangedBind);
    this.gridApi.removeEventListener('sortChanged', this.onFilterSortChangedBind);
  }

  private regsiterEvents() {
    this.removeEventListeners();
    this.gridApi.addEventListener('filterChanged', this.onFilterSortChangedBind);
    this.gridApi.addEventListener('sortChanged', this.onFilterSortChangedBind);
  }

  /**
   * An event handler for saving filter & sorting upon change.
   */
  private onFilterSortChanged() {
    const filter = this.gridApi.getFilterModel();
    const sort = this.gridApi.getSortModel();

    // save grid's configuration
    setGridModel(this.gridName, {
      filter,
      sort
    });
  }

  /**
   * Save current filter & sorting models
   */
  private setSavedModel() {
    const model = getGridModel(this.gridName);
    if (model.sort) {
      this.gridApi.setSortModel(model.sort);
    }
    if (model.filter) {
      this.gridApi.setFilterModel(model.filter);
    }
  }

  /**
   * Initial the grid ready event
   * @param {DatoGridComponent} datoGrid
   */
  private initialGridReady(datoGrid: DatoGridComponent) {
    if (datoGrid) {
      datoGrid.gridReady.subscribe((grid: DetailGridInfo) => {
        this.gridApi = grid.api;
        this.datoGridReady.next(grid);
        this.datoGridReady.complete();

        // load saved grid's model
        this.setSavedModel();
        // register to filter & sorting change
        this.regsiterEvents();
      });
    }
  }
}
