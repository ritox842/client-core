import { Component } from "@angular/core";
import { timer } from "rxjs/observable/timer";
import { concatMap, mapTo, tap } from "rxjs/operators";
import { DatoGrid } from "../../../../../../../lib/src/grid/dato-grid";
import {
  GridColumns,
  ToolbarAction,
  ToolbarActionType
} from "../../../../../../../lib";

@Component({
  selector: "dato-grid-advanced-preview",
  templateUrl: "./grid-advanced-preview.component.html"
})
export class GridAdvancedPreviewComponent extends DatoGrid<any> {
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
        field: "idValue",
        headerName: "ID & Value"
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
    return [
      {
        actionType: ToolbarActionType.Delete,
        click: this.removeSelectedRows.bind(this)
      }
    ];
  }

  asyncRows() {
    let rows = [];
    for (let i = 0; i < 1000; i++) {
      rows.push({ id: i, value: i * 5, updateTime: new Date() });
    }
    return timer(3000).pipe(mapTo(rows));
  }
}
