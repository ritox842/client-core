import { Component } from "@angular/core";
import {
  DatoGrid,
  GridColumns
} from "../../../../../../../lib/src/grid/dato-grid";
import { ToolbarAction } from "../../../../../../../lib/src/grid/grid-toolbar/grid-toolbar.types";
import { RowSelectionType, ToolbarActionType } from "../../../../../../../lib";

@Component({
  selector: "dato-grid-basic-toolbar-preview",
  templateUrl: "./grid-basic-toolbar-preview.component.html"
})
export class GridBasicToolbarPreviewComponent extends DatoGrid<any> {
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
    return [
      {
        actionType: ToolbarActionType.Add,
        click: function() {
          /* Add new row here */
        }
      },
      {
        actionType: ToolbarActionType.Edit,
        click: function() {
          /* Edit the row */
        }
      },
      {
        actionType: ToolbarActionType.Delete,
        click: this.removeSelectedRows.bind(this)
      },
      {
        actionType: ToolbarActionType.Copy,
        click: function() {
          /* Copy the row */
        }
      },
      {
        text: "single row?",
        icon: "edit",
        showWhen: RowSelectionType.SINGLE,
        click: function() {
          /* Do something here */
        }
      },
      {
        text: "multiple rows?",
        icon: "edit",
        showWhen: RowSelectionType.MULTI,
        click: function() {
          /* Do something here */
        }
      }
    ];
  }
}
