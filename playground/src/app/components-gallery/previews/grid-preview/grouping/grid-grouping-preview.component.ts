import { Component } from "@angular/core";
import {
  DatoGrid,
  GridColumns
} from "../../../../../../../lib/src/grid/dato-grid";
import { ToolbarAction } from "../../../../../../../lib/src/grid/grid-toolbar/grid-toolbar.types";

@Component({
  selector: "dato-grid-grouping-preview",
  templateUrl: "./grid-grouping-preview.component.html"
})
export class GridGroupingPreviewComponent extends DatoGrid<any> {
  data = [
    {
      id: 1,
      group: "Group A",
      value: "Item one"
    },
    {
      id: 2,
      group: "Group A",
      value: "Item two"
    },
    {
      id: 3,
      group: "Group A",
      value: "Item three"
    },
    {
      id: 4,
      group: "Group B",
      value: "Item three"
    },
    {
      id: 5,
      group: "Group B",
      value: "Item three"
    },
    {
      id: 6,
      group: "Group C",
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
        headerName: "Group",
        field: "group",
        rowGroup: true,
        hide: true
      },
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
