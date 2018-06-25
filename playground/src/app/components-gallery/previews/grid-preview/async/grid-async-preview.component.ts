import { Component } from "@angular/core";
import { timer } from "rxjs";
import { concatMap, mapTo, tap } from "rxjs/operators";
import { DatoGrid } from "../../../../../../../lib/src/grid/dato-grid";
import { GridColumns, ToolbarAction } from "../../../../../../../lib";

@Component({
  selector: "dato-grid-async-preview",
  templateUrl: "./grid-async-preview.component.html"
})
export class GridAsyncPreviewComponent extends DatoGrid<any> {
  data;

  ngOnInit() {
    super.ngOnInit();
  }

  loadData() {
    this.asyncRows()
      .pipe(
        tap(data => (this.data = data)),
        concatMap(grid => this.datoGridReady)
      )
      .subscribe(rows => {
        this.setRows(this.data);
      });
  }

  asyncRows() {
    let rows = [];
    for (let i = 0; i < 1000; i++) {
      rows.push({ id: i, value: i * 5, updateTime: new Date() });
    }
    return timer(3000).pipe(mapTo(rows));
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
        field: "updateTime",
        valueFormatter({ value }) {
          return value.toDateString();
        },
        headerName: "Update Time",
        filter: "agDateColumnFilter"
      }
    ];
  }

  getToolbarActions(): ToolbarAction[] {
    return [];
  }
}
