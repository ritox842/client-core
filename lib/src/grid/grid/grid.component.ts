import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid';

@Component({
  selector: 'dato-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatoGridComponent {
  @Output() rowDataChanged = new EventEmitter();

  private defaultGridOptions: GridOptions = {
    // Replace the build-in pagination
    suppressPaginationPanel: true,
    pagination: true,
    onRowDataChanged: event => {
      this.rowDataChanged.emit(event);
    },
    rowSelection: 'multiple',
    rowDeselection: true
  };

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;

  @HostBinding('class.grid-pagination') hasPagination = true;

  @Input()
  set options(options: GridOptions) {
    this.gridOptions = { ...this.defaultGridOptions, ...options };
    // check if we got a pagination
    this.hasPagination = this.gridOptions.pagination;
  }

  get options(): GridOptions {
    return this.gridOptions;
  }

  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  constructor() {
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
}
