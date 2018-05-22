import { Component } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../lib/src/dialog/dialog-ref";
import { DatoDialog } from "../../../../../../../lib/src/dialog/dialog.service";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "dato-dirty-dialog",
  templateUrl: "./dirty-dialog.component.html"
})
export class DatoDirtyDialogComponent {
  constructor(private dialogRef: DatoDialogRef, private dialog: DatoDialog) {
    dialogRef.beforeClosed(this.showConfirmation.bind(this));
  }

  showConfirmation(result): Observable<boolean> {
    const a = this.dialog
      .confirm({
        title: "Close",
        content: "Are you sure you want to close the dialog?"
      })
      .afterClosed();

    return a.pipe(
      switchMap(a => {
        return of(true);
      })
    );
  }
}
