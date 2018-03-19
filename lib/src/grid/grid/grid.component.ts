import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid';
import { DatoTranslateService } from '../../services/translate.service';

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
    this.translateColumns(options);
    this.gridOptions = { ...this.defaultGridOptions, ...options };
    // check if we got a pagination
    this.hasPagination = this.gridOptions.pagination;
  }

  get options(): GridOptions {
    return this.gridOptions;
  }

  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  constructor(private translate: DatoTranslateService,
              private element: ElementRef) {
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
    this.gridOptions.columnApi.autoSizeAllColumns();
    const {width} = this.element.nativeElement.getBoundingClientRect();
    const agBody = this.element.nativeElement.querySelector(".ag-body-container");
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
