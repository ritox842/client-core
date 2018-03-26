import {Component} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {concatMap, mapTo} from "rxjs/operators";
import {DatoGrid} from "../../../../../../../lib/src/grid/dato-grid";
import {GridColumns, ToolbarAction} from "../../../../../../../lib";

@Component({
  selector: 'dato-grid-basic-preview',
  templateUrl: './grid-basic-preview.component.html'
})
export class GridBasicPreviewComponent extends DatoGrid<any> {

  ngOnInit() {
    super.ngOnInit();
    this.datoGridReady.pipe(
      concatMap(( grid ) => this.asyncRows())
    ).subscribe(( rows ) => {
      this.setRows(rows);
    });
  }

  getColumns(): GridColumns {
    return [
      {
        headerName: 'ID',
        field: 'id',
        width: 100,
        filter: "agNumberColumnFilter"
      },
      {
        headerName: 'Value',
        field: 'value',
        width: 100,
        filter: "agTextColumnFilter"
      },
    ];
  }

  getToolbarActions(): ToolbarAction[] {
    return [];
  }

  getRows(): Partial<any>[] {
    return [];
  }

  asyncRows() {
    let rows = [];
    for ( let i = 0; i < 1000; i ++ ) {
      rows.push({id: i, value: i * 5});
    }
    return timer(3000).pipe(mapTo(rows))

  }

  myCustomLogic( selectedRows: any[] ) {
    return selectedRows.some(( row ) => row.value === 5);
  }

}
