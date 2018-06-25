import { Component } from "@angular/core";
import {
  DatoGrid,
  GridColumns,
  RowSelectionType,
  ToolbarAction,
  ToolbarActionType
} from "../../../../../../../lib";

@Component({
  selector: "dato-grid-actions-preview",
  templateUrl: "./grid-actions-preview.component.html"
})
export class GridActionsPreviewComponent extends DatoGrid<any> {
  ngOnInit() {
    super.ngOnInit();
    this.datoGridReady.subscribe(() => {
      this.setRows([
        {
          id: 1,
          value: "one"
        },
        {
          id: 2,
          value: "two"
        },
        {
          id: 3,
          value: "three"
        }
      ]);
    });
  }

  getColumns(): GridColumns {
    return [
      {
        headerName: "ID",
        field: "id",
        width: 100
      },
      {
        headerName: "Value",
        field: "value",
        width: 100
      }
    ];
  }

  getToolbarActions(): ToolbarAction[] {
    return [
      {
        actionType: ToolbarActionType.Add,
        click: function() {
          alert("you clicked me :)");
        }
      },
      {
        actionType: ToolbarActionType.Edit,
        click: function() {
          alert("you clicked me :)");
        }
      },
      {
        actionType: ToolbarActionType.Delete,
        click: this.removeSelectedRows.bind(this)
      },
      {
        actionType: ToolbarActionType.Copy,
        click: function() {
          alert("you clicked me :)");
        }
      },
      {
        text: "cool button",
        icon: "edit",
        showWhen: RowSelectionType.SINGLE,
        click: function() {
          alert("you clicked me :)");
        }
      }
    ];
  }
}
