/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { GridApi, RowNode } from 'ag-grid';
import { coerceArray, toBoolean } from '@datorama/utils';

/**
 * Datorama abstraction to agGrid API
 */
export class DatoGridAPI<T = any> {
  private _gridApi: GridApi;

  get ready() {
    return toBoolean(this.gridApi);
  }

  get gridApi() {
    return this._gridApi;
  }

  set gridApi(gridApi) {
    this._gridApi = gridApi;
  }

  constructor(gridApi?: GridApi) {
    this.gridApi = gridApi;
  }

  setSelectedRows(row: T & RowNode | T[] & RowNode[]) {
    const rows = coerceArray(row);
    this.gridApi.forEachNode(rowNode => {
      const isSelected = rows.some(r => r === rowNode.data);
      // prevent redundant updates
      if (rowNode.isSelected() !== isSelected) {
        rowNode.setSelected(isSelected);
      }
    });
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
  addRows(row: T, index: number = null): any {
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
