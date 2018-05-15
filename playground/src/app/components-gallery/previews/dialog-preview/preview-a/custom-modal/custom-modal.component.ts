import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../../lib/src/dialog/dialog-ref";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-custom-modal",
  templateUrl: "./custom-modal.component.html",
  encapsulation: ViewEncapsulation.None
})
export class CustomModalComponent implements OnInit {
  name: string;

  animalControl = new FormControl("");

  constructor(private dialogRef: DatoDialogRef) {
    this.name = dialogRef.data.name;
  }

  ngOnInit() {}
}
