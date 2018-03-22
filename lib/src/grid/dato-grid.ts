import {ColDef, ColGroupDef, GridApi, GridOptions, RowNode} from 'ag-grid';
import {coerceArray, toBoolean} from '@datorama/utils';
import {OnInit} from '@angular/core';
import {ToolbarAction} from './grid-toolbar/grid-toolbar';

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

  abstract getRows(): Partial<T>[];

  ngOnInit() {
    this.options = {columnDefs: this.getColumns()};
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
}
