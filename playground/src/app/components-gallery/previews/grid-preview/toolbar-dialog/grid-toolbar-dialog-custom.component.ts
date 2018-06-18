import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-grid-toolbar-dialog-custom",
  templateUrl: "./grid-toolbar-dialog-custom.component.html"
})
export class GridToolbarDialogCustomComponent {
  valueControl = new FormControl("My New Item");
}
