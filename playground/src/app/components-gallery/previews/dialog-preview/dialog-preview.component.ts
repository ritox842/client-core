import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DatoDialog } from "../../../../../../lib/src/services/dialog.service";
import { CustomModalComponent } from "./custom-modal/custom-modal.component";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-dialog-preview",
  templateUrl: "./dialog-preview.component.html",
  styleUrls: ["./dialog-preview.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DialogPreviewComponent implements OnInit {
  nameControl = new FormControl("");

  constructor(private modalService: DatoDialog) {}

  ngOnInit() {}

  openDialog() {
    this.modalService.open(CustomModalComponent, {
      data: {
        name: this.nameControl.value
      }
    });
  }
}
