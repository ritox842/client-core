import { Component, ViewEncapsulation } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../../lib/src/dialog/dialog-ref";
import { DatoDialog } from "../../../../../../../../lib/src/services/dialog.service";

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
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
