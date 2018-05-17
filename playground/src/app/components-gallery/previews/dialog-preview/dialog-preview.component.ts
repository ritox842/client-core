import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DatoDialog } from "../../../../../../lib/src/services/dialog.service";

@Component({
  selector: "dato-dialog-preview",
  templateUrl: "./dialog-preview.component.html"
})
export class DialogPreviewComponent implements OnInit {
  dialogWidthControl = new FormControl("400px");
  dialogHeightControl = new FormControl("500px");

  constructor(private dialog: DatoDialog) {}

  ngOnInit() {}

  openDialogWithSize() {
    this.dialog.confirm({
      width: this.dialogWidthControl.value,
      height: this.dialogHeightControl.value,
      title: "Greeting from Dialog",
      content: "hi there!"
    });
  }
}
