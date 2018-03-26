import {ColDef, ColGroupDef, DetailGridInfo, GridApi, GridOptions, RowNode} from 'ag-grid';
import {coerceArray, toBoolean} from '@datorama/utils';
import {AfterContentInit, AfterViewInit, ContentChild, OnInit, ViewChild} from '@angular/core';
import {ToolbarAction} from './grid-toolbar/grid-toolbar';
import {DatoGridComponent} from "./grid/grid.component";
import {Subject} from "rxjs/Subject";

export type GridColumns = (ColDef | ColGroupDef)[];

export abstract class DatoGrid<T> implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild(DatoGridComponent) gridViewChild: DatoGridComponent;
  @ContentChild(DatoGridComponent) gridContentChild: DatoGridComponent;

  options: GridOptions;
  toolbarActions: ToolbarAction[];
  datoGridReady = new Subject<DetailGridInfo>();
  private _gridApi: GridApi;

  get gridApi() {
    return this._gridApi;
  }

  set gridApi( gridApi ) {
    this._gridApi = gridApi;
  }

  abstract getColumns(): GridColumns;

  abstract getToolbarActions(): ToolbarAction[];

  ngOnInit() {
    this.options = {columnDefs: this.getColumns()};
    this.toolbarActions = this.getToolbarActions();
  }

  ngAfterViewInit() {
    this.initialGridReady(this.gridViewChild);
  }

  ngAfterContentInit() {
    this.initialGridReady(this.gridContentChild);
  }

  /**
   *
   * @returns {T}
   */
  getSelectedRows( onlyFirstRow: true ): T & RowNode;
  getSelectedRows( onlyFirstRow?: false ): T[] & RowNode[];
  getSelectedRows( onlyFirstRow: boolean ): T[] & RowNode[] | T & RowNode;
  getSelectedRows( onlyFirstRow = false ): T[] & RowNode[] | T & RowNode {
    const rows = this.gridApi.getSelectedRows();
    if ( ! onlyFirstRow ) {
      return rows;
    }
    return rows.length ? rows[ 0 ] : null;
  }

  /**
   *
   * @param data
   */
  setRows( data: T[] ) {
    this.gridApi.setRowData(data);
    this.gridApi.sizeColumnsToFit();
  }

  /**
   *
   * @param {T} row
   * @param {number} index
   * @returns {RowNodeTransaction}
   */
  addRows( row: T, index: number ): any {
    const rows = coerceArray(row);
    let data: any = {
      add: rows
    };
    if ( toBoolean(index) ) {
      data.addIndex = index;
    }
    return this.gridApi.updateRowData(data);
  }

  /**
   *
   * @param {T[]} row
   * @returns {RowNodeTransaction}
   */
  updateRows( row: T[] ): any {
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
  updateRowValue( id: string, key: string, newValue: any ) {
    const rowNode = this.gridApi.getRowNode(id);
    rowNode.setDataValue(key, newValue);
  }

  /**
   *
   * @param {RowNode | RowNode[]} row
   * @returns {RowNodeTransaction}
   */
  removeRows( row: RowNode | RowNode[] ): any {
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

  /**
   * Initial the grid ready event
   * @param {DatoGridComponent} datoGrid
   */
  private initialGridReady( datoGrid: DatoGridComponent ) {
    if ( datoGrid ) {
      datoGrid.gridReady.subscribe(( grid: DetailGridInfo ) => {
        this.gridApi = grid.api;
        this.datoGridReady.next(grid);
        this.datoGridReady.complete();
      });
    }
  }
}
