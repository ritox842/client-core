import { Component, ViewEncapsulation } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../../lib/src/dialog/dialog-ref";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-custom-dialog",
  templateUrl: "./custom-dialog.component.html",
  encapsulation: ViewEncapsulation.None
})
export class CustomDialogComponent {
  name: string;

  animalControl = new FormControl("");

  constructor(private dialogRef: DatoDialogRef) {
    this.name = dialogRef.data.name;
  }
}
