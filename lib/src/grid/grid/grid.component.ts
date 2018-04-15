/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid';
import { DatoTranslateService } from '../../services/translate.service';
import { IconRegistry } from '../../services/icon-registry';
import { getGridIcons } from './grid-icons';

export type ExtendedGridOptions = {
  onRowDataUpdated: (event) => void;
};
export type DatoGridOptions = ExtendedGridOptions & GridOptions;

@Component({
  selector: 'dato-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatoGridComponent {
  @Output() rowDataChanged = new EventEmitter();

  private defaultGridOptions: DatoGridOptions = {
    // Replace the build-in pagination
    suppressPaginationPanel: true,
    pagination: true,
    onRowDataChanged: event => {
      this.rowDataChanged.emit(event);
    },
    onRowDataUpdated: event => {
      this.rowDataChanged.emit(event);
    },
    rowSelection: 'multiple',
    rowDeselection: true,
    icons: {},
    unSortIcon: true,
    toolPanelSuppressSideButtons: true,
    showToolPanel: false
  };

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: DatoGridOptions;

  @HostBinding('class.grid-pagination') hasPagination = true;

  @Input() enableSorting = true;
  @Input() enableFilter = true;
  @Input() enableColResize = true;

  @Input()
  set options(options: DatoGridOptions) {
    this.translateColumns(options);
    this.gridOptions = { ...this.defaultGridOptions, ...options };
    // check if we got a pagination
    this.hasPagination = this.gridOptions.pagination;
  }

  get options(): DatoGridOptions {
    return this.gridOptions;
  }

  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  constructor(private translate: DatoTranslateService, private element: ElementRef, private iconRegistry: IconRegistry) {
    this.defaultGridOptions.icons = getGridIcons(iconRegistry);

    this.gridOptions = { ...this.defaultGridOptions };
  }

  /**
   * On grid ready
   * @param {GridReadyEvent} event
   */
  onGridReady(event: GridReadyEvent) {
    // set grid API
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;

    this.gridReady.emit(event);
  }

  /**
   * call ag-grid's size all columns to fit to container
   */
  fitToContainer(): void {
    this.gridOptions.api.sizeColumnsToFit();
  }

  /**
   * call ag-grid's size all columns to fit to content
   */
  fitToContent(): void {
    this.gridOptions.columnApi.autoSizeAllColumns('api');
    const { width } = this.element.nativeElement.getBoundingClientRect();
    const agBody = this.element.nativeElement.querySelector('.ag-body-container');
    const bodyWidth: number = agBody ? agBody.clientWidth : 0;
    if (width > bodyWidth) {
      this.fitToContainer();
    }
  }

  /**
   *
   * @param {GridOptions} options
   */
  private translateColumns(options: GridOptions) {
    options.columnDefs = options.columnDefs.map(column => {
      return {
        ...column,
        headerName: this.translate.transform(column.headerName)
      };
    });
  }
}
