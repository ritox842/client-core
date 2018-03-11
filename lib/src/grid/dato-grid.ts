import { ColDef, ColGroupDef, GridApi, GridOptions, RowNode } from 'ag-grid';
import { coerceArray, toBoolean } from '@datorama/utils';
import { OnInit } from '@angular/core';
import { ToolbarAction } from './grid-toolbar/grid-toolbar';

export type GridColumns = (ColDef | ColGroupDef)[];

export abstract class DatoGrid<T> implements OnInit {
  options: GridOptions;
  toolbarActions: ToolbarAction[];
  private _gridApi: GridApi;

  get gridApi() {
    return this._gridApi;
  }

  set gridApi(gridApi) {
    this._gridApi = gridApi;
  }

  abstract getColumns(): GridColumns;

  abstract getToolbarActions(): ToolbarAction[];

  abstract getRows(value: T[]): Partial<T>[];

  ngOnInit() {
    this.options = { columnDefs: this.getColumns() };
  }

  /**
   *
   * @returns {T}
   */
  getSelectedRow(): T & RowNode {
    return this.gridApi.getSelectedRows()[0];
  }

  /**
   *
   * @param data
   */
  setRows(data) {
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
  removeSelectedRow() {
    const selectedRow = this.gridApi.getSelectedRows()[0];
    return this.removeRows(selectedRow);
  }

  /**
   * Clear all the rows
   */
  clearTable() {
    this.setRows([]);
  }
}
