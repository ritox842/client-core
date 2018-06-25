import { Component } from "@angular/core";
import { DatoDialog } from "../../../../../../../lib/src/dialog/dialog.service";
import { MyCustomDialogComponent } from "./custom-dialog/custom-dialog.component";

@Component({
  selector: "dato-dialog-multiple-preview",
  templateUrl: "./dialog-multiple-preview.component.html"
})
export class DatoDialogMultiplePreviewComponent {
  constructor(private dialog: DatoDialog) {}

  openDialog() {
    this.dialog
      .open(MyCustomDialogComponent, {})
      .afterClosed()
      .subscribe(() => {
        console.log("dialog closes");
      });
  }
}
