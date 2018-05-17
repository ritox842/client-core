import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatoSnackbar, SnackbarType } from "../../../../../../lib";

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
      .snack(this.msg, SnackbarType.SUCCESS, {
        dismissible: true
      })
      .afterDismissed.subscribe(console.log);

    // this.snackbar.snack("hello", SnackbarType.DRAMATIC_ERROR, {
    //   dismissible: true
    // }).afterDismissed.subscribe(console.log);
  }
}
