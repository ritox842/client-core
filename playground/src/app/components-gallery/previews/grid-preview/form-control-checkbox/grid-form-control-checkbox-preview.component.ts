import { Component } from "@angular/core";
import { DatoGrid } from "../../../../../../../lib/src/grid/dato-grid";
import { GridColumns, ToolbarAction } from "../../../../../../../lib";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-grid-form-control-checkbox-preview",
  templateUrl: "./grid-form-control-checkbox-preview.component.html"
})
export class GridFormControlCheckboxPreviewComponent extends DatoGrid<any> {
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

  selectedRowsControl = new FormControl([this.data[0]]);

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
        filter: "agNumberColumnFilter",
        headerCheckboxSelection: true,
        checkboxSelection: true
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
