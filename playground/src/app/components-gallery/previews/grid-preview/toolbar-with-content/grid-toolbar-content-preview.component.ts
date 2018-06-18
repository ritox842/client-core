import { Component } from "@angular/core";
import {
  DatoGrid,
  GridColumns
} from "../../../../../../../lib/src/grid/dato-grid";
import {
  RowSelectionType,
  ToolbarAction,
  ToolbarActionType
} from "../../../../../../../lib";
import { GridToolbarDialogCustomComponent } from "./grid-toolbar-dialog-custom.component";

@Component({
  selector: "dato-grid-toolbar-content-preview",
  templateUrl: "./grid-toolbar-content-preview.component.html"
})
export class GridToolbarContentPreviewComponent extends DatoGrid<any> {
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

  constructor() {
    super();
  }

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
    return [
      {
        actionType: ToolbarActionType.Add
      },
      {
        actionType: ToolbarActionType.Delete
      },
      {
        text: "Click Me",
        showWhen: RowSelectionType.MULTI
      }
    ];
  }
}
