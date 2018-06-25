import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DatoDialog } from "../../../../../../lib/src/dialog/dialog.service";
import { DatoDirtyDialogComponent } from "./dirty-dialog/dirty-dialog.component";
import { Dimensions } from "../../../../../../lib/src/types/public_api";

@Component({
  selector: "dato-dialog-preview",
  templateUrl: "./dialog-preview.component.html"
})
export class DialogPreviewComponent {
  dialogWidthControl = new FormControl("400px");
  dialogHeightControl = new FormControl("500px");

  constructor(private dialog: DatoDialog) {}

  openDialogWithSize(size: Dimensions) {
    this.dialog.confirm({
      size: size,
      title: "Greeting from Dialog",
      content: `I'm the <strong>${size}</strong> size!`
    });
  }

  openDialogWithCustomSize() {
    this.dialog.confirm({
      width: this.dialogWidthControl.value,
      height: this.dialogHeightControl.value,
      title: "Greeting from Dialog",
      content: "hi there!"
    });
  }

  openDialogWithDirtyCheck() {
    this.dialog.open(DatoDirtyDialogComponent, {});
  }
}
