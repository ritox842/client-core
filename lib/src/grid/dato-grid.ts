/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ColDef, ColGroupDef, DetailGridInfo, GridOptions } from 'ag-grid';
import { getFunctionName } from '@datorama/utils';
import { ContentChild, OnInit, ViewChild } from '@angular/core';
import { ToolbarAction } from './grid-toolbar/grid-toolbar.types';
import { DatoGridComponent } from './grid/grid.component';
import { Subject } from 'rxjs/Subject';
import { getGridModel, setGridModel } from './grid-config';
import { DatoGridAPI } from './dato-grid-api';

export type GridColumns = (ColDef | ColGroupDef)[];

/**
 * Base component for grid components
 */
export abstract class DatoGrid<T> extends DatoGridAPI<T> implements OnInit {
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

  private onFilterSortChangedBind;
  private gridName: string;

  constructor() {
    super();

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
