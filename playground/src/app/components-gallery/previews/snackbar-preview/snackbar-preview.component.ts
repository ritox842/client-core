import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatoSnackbar } from "../../../../../../lib";

@Component({
  selector: "dato-snackbar-preview",
  templateUrl: "./snackbar-preview.component.html",
  styleUrls: ["./snackbar-preview.component.scss"]
})
export class SnackbarPreviewComponent implements OnInit {
  @ViewChild("msg") msg: TemplateRef<any>;

  constructor(private snackbar: DatoSnackbar) {}

  ngOnInit() {}

  snack() {
    this.snackbar
      .info("hello", {
        dismissible: true
      })
      .afterDismissed.subscribe(console.log);
  }

  info() {
    this.snackbar.info(this.msg).afterDismissed.subscribe(console.log);
  }

  error() {
    this.snackbar.error(this.msg);
  }

  success() {
    this.snackbar.success(this.msg);
  }

  dramaticSuccess() {
    this.snackbar.dramaticSuccess(this.msg);
  }

  dramaticError() {
    this.snackbar.dramaticError(this.msg);
  }
}
