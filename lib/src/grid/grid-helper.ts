import { Injectable } from '@angular/core';
import { ColDef, ColGroupDef, GridApi } from 'ag-grid';
import { DatoTranslateService } from '../services/translate.service';
import { DatoCoreError } from '../errors';

@Injectable()
export class DatoGridHelper {
  constructor(private translate: DatoTranslateService) {}

  /**
   * Updaet the columns definitions
   * @param {GridApi} gridApi
   * @param {(ColDef | ColGroupDef)[]} columnDefs
   */
  updateColumns(gridApi: GridApi, columnDefs: (ColDef | ColGroupDef)[]) {
    if (!columnDefs) {
      throw new DatoCoreError('No columnDefs were provided.');
    }

    columnDefs = this.translateColumns(columnDefs);
    gridApi.setColumnDefs(columnDefs);
  }

  /**
   * Translate the header name of each column
   * @param {GridOptions} options
   */
  translateColumns(columnDefs: (ColDef | ColGroupDef)[]): (ColDef | ColGroupDef)[] {
    return columnDefs.map(column => {
      return {
        ...column,
        headerName: this.translate.transform(column.headerName)
      };
    });
  }
}
