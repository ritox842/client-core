import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DatoDialogRef } from "../../../../../../../lib/src/dialog/dialog-ref";

@Component({
  selector: "dato-custom-modal",
  templateUrl: "./custom-modal.component.html",
  encapsulation: ViewEncapsulation.None
})
export class CustomModalComponent implements OnInit {
  constructor(private activeModal: DatoDialogRef) {}

  ngOnInit() {}
}
