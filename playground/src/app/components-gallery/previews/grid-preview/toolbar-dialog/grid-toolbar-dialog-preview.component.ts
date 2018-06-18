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
import { DatoDialog } from "../../../../../../../lib/src/dialog/dialog.service";
import { GridToolbarDialogCustomComponent } from "./grid-toolbar-dialog-custom.component";
import {
  DatoDialogResult,
  DialogResultStatus
} from "../../../../../../../lib/src/dialog/config/dialog.options";
import { ConfirmationType } from "../../../../../../../lib/src/dialog/config/dialog-confirmation.options";
import {
  ToolbarConfirmation,
  ToolbarConfirmationHandlerResult,
  ToolbarDeleteConfirmation
} from "../../../../../../../lib/src/grid/grid-toolbar/grid-toolbar-handlers";
import { GridApi } from "ag-grid";

@Component({
  selector: "dato-grid-toolbar-dialog-preview",
  templateUrl: "./grid-toolbar-dialog-preview.component.html"
})
export class GridToolbarDialogPreviewComponent extends DatoGrid<any> {
  private lastId = 3;

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

  constructor(private dialog: DatoDialog) {
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
        actionType: ToolbarActionType.Add,
        click: () => {
          this.dialog
            .open(GridToolbarDialogCustomComponent)
            .afterClosed()
            .subscribe((result: DatoDialogResult<string>) => {
              if (result.status === DialogResultStatus.SUCCESS) {
                this.addRows({
                  id: ++this.lastId,
                  value: result.data
                });
              }
            });
        }
      },
      {
        actionType: ToolbarActionType.Delete,
        click: new ToolbarDeleteConfirmation({
          afterClosed: (result: ToolbarConfirmationHandlerResult) => {
            console.log(`Got: ${result.dialogResult.status}`);
          }
        })
      },
      {
        text: "Click Me",
        showWhen: RowSelectionType.MULTI,
        click: new ToolbarConfirmation({
          dialogOptions: {
            title: "My Awesome Dialog",
            content: "Some <strong>content</strong> here"
          },
          afterClosed: (result: ToolbarConfirmationHandlerResult) => {
            console.log(
              `Got: ${result.dialogResult.status}, for ${
                result.selectedRows.length
              } rows.`
            );
          }
        })
      }
    ];
  }
}
