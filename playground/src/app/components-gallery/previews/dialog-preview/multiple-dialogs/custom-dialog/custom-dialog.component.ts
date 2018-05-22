import { Component, ViewEncapsulation } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../../lib/src/dialog/dialog-ref";
import { DatoDialog } from "../../../../../../../../lib/src/dialog/dialog.service";
import {
  DatoDialogResult,
  DialogResultType
} from "../../../../../../../../lib/src/dialog/config/dialog.options";

@Component({
  selector: "dato-my-custom-dialog",
  templateUrl: "./custom-dialog.component.html",
  encapsulation: ViewEncapsulation.None
})
export class MyCustomDialogComponent {
  constructor(private dialogRef: DatoDialogRef, private dialog: DatoDialog) {}

  closeDialog() {
    this.dialog
      .confirm({
        title: "Close",
        content: "Are you sure you want to close the dialog?"
      })
      .afterClosed()
      .subscribe((result: DatoDialogResult) => {
        if (result.type === DialogResultType.SUCCESS) {
          this.dialogRef.close();
        }
      });
  }
}
