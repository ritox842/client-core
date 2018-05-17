import { Component, OnInit } from "@angular/core";
import { DatoDialog } from "../../../../../../../lib/src/services/dialog.service";

@Component({
  selector: "dato-dialog-draggable-preview",
  templateUrl: "./dialog-draggable-preview.component.html"
})
export class DatoDialogDraggablePreviewComponent implements OnInit {
  constructor(private modalService: DatoDialog) {}

  ngOnInit() {}

  openDialog() {
    this.modalService.confirm({
      draggable: true,
      title: "Drag Me",
      content: "This dialog is draggable :-)"
    });
  }
}
