import { Component, OnInit } from "@angular/core";
import { CustomModalComponent } from "./custom-modal/custom-modal.component";
import { FormControl } from "@angular/forms";
import { DatoDialog } from "../../../../../../../lib/src/services/dialog.service";

@Component({
  selector: "dato-dialog-preview-a",
  templateUrl: "./dialog-preview-a.component.html"
})
export class DialogPreviewAComponent implements OnInit {
  nameControl = new FormControl("");
  animal: string;

  constructor(private modalService: DatoDialog) {}

  ngOnInit() {}

  openDialog() {
    this.modalService
      .open(CustomModalComponent, {
        data: {
          name: this.nameControl.value
        }
      })
      .afterClose()
      .subscribe((result: string) => {
        this.animal = result;
      });
  }
}
