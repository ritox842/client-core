import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatoToast } from "../../../../../../lib";
import { ToastOptions } from "../../../../../../lib/src/toast/toast.types";
import { CustomToastComponent } from "./custom-toast.component";

@Component({
  selector: "dato-toast-preview",
  templateUrl: "./toast-preview.component.html",
  styleUrls: ["./toast-preview.component.scss"]
})
export class ToastPreviewComponent implements OnInit {
  @ViewChild("tpl") tpl: TemplateRef<any>;

  constructor(private datoToast: DatoToast) {}

  ngOnInit() {}

  toast() {
    const options: ToastOptions = {
      icon: {
        name: "alert"
      }
    };
    this.datoToast.open("A Message From Another Module's Process 1", options);
  }

  withoutIcon() {
    this.datoToast.open("A Message From Another Module's Process 2");
  }

  withTpl() {
    const options: ToastOptions = {
      icon: {
        name: "alert"
      },
      content: this.tpl
    };
    this.datoToast.open("A Message From Another Module's Process 3", options);
  }

  WithComponent() {
    const options: ToastOptions = {
      icon: {
        name: "alert"
      },
      data: { name: "Datorama" }
    };
    this.datoToast.open(CustomToastComponent, options);
  }
}
