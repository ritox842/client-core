import { Component } from "@angular/core";
import {
  DatoGrid,
  GridColumns
} from "../../../../../../../lib/src/grid/dato-grid";
import { ToolbarAction } from "../../../../../../../lib/src/grid/grid-toolbar/grid-toolbar.types";

@Component({
  selector: "dato-grid-basic-preview",
  templateUrl: "./grid-basic-preview.component.html"
})
export class GridBasicPreviewComponent extends DatoGrid<any> {
  data = [
    {
      id: 1,
      value: "Item one"
    },
    {
      id: 2,
      value: "Item two"
    },
    {
      id: 3,
      value: "Item three"
    }
  ];

  ngOnInit() {
    super.ngOnInit();

    this.datoGridReady.subscribe(() => {
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
      }
    ];
  }

  getToolbarActions(): ToolbarAction[] {
    return [];
  }
}
