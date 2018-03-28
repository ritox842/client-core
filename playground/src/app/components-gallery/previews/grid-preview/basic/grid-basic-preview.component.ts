import { Component } from "@angular/core";
import { timer } from "rxjs/observable/timer";
import { concatMap, mapTo, tap } from "rxjs/operators";
import { DatoGrid } from "../../../../../../../lib/src/grid/dato-grid";
import { GridColumns, ToolbarAction } from "../../../../../../../lib";

@Component({
  selector: "dato-grid-basic-preview",
  templateUrl: "./grid-basic-preview.component.html"
})
export class GridBasicPreviewComponent extends DatoGrid<any> {
  data;

  ngOnInit() {
    super.ngOnInit();

    this.asyncRows()
      .pipe(
        tap(data => (this.data = data)),
        concatMap(grid => this.datoGridReady)
      )
      .subscribe(rows => {
        this.setRows(this.data);
      });
  }

  getColumns(): GridColumns {
    return [
      {
        headerName: "ID",
        field: "id",
        width: 100,
        filter: "agNumberColumnFilter"
      },
      {
        headerName: "Value",
        field: "value",
        width: 100,
        filter: "agTextColumnFilter"
      },
      {
        valueGetter(params) {
          const { id, value } = params.data;

          return `${id} ${value}`;
        },
        headerName: "IdValue"
      }
    ];
  }

  getToolbarActions(): ToolbarAction[] {
    return [];
  }

  asyncRows() {
    let rows = [];
    for (let i = 0; i < 1000; i++) {
      rows.push({ id: i, value: i * 5 });
    }
    return timer(3000).pipe(mapTo(rows));
  }

  myCustomLogic(selectedRows: any[]) {
    return selectedRows.some(row => row.value === 5);
  }
}
