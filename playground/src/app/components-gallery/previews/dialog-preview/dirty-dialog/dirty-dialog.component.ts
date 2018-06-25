import { Component } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../lib/src/dialog/dialog-ref";
import { DatoDialog } from "../../../../../../../lib/src/dialog/dialog.service";
import { switchMap } from "rxjs/operators";
import { of, Observable } from "rxjs";
import {
  DatoDialogResult,
  DialogResultStatus
} from "../../../../../../../lib/src/dialog/config/dialog.options";

@Component({
  selector: "dato-dirty-dialog",
  templateUrl: "./dirty-dialog.component.html"
})
export class DatoDirtyDialogComponent {
  constructor(private dialogRef: DatoDialogRef, private dialog: DatoDialog) {
    dialogRef.beforeClosed(this.showConfirmation.bind(this));
  }

  showConfirmation(result: DatoDialogResult): Observable<boolean> {
    return this.dialog
      .confirm({
        title: "Close",
        content: "Are you sure you want to close the dialog?"
      })
      .afterClosed()
      .pipe(
        switchMap((confirmResult: DatoDialogResult) => {
          return of(confirmResult.status === DialogResultStatus.SUCCESS);
        })
      );
  }
}
