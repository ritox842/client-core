import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatoPanel } from "../../../../../../lib";
import {
  PanelDemoAkitaComponent,
  PanelDemoComponent
} from "./panel-demo.component";

@Component({
  selector: "dato-panel-preview",
  templateUrl: "./panel-preview.component.html",
  styleUrls: ["./panel-preview.component.scss"]
})
export class PanelPreviewComponent implements OnInit {
  @ViewChild("demo") tpl: TemplateRef<any>;

  constructor(private panelService: DatoPanel) {}

  open() {
    this.panelService.open(PanelDemoComponent);
  }

  close() {
    this.panelService.close();
  }

  openSmall() {
    this.panelService.open(this.tpl, {
      relativeTo: ".custom-relative",
      height: 200,
      offset: { left: 62 }
    });
  }

  ngOnInit(): void {}

  open2() {
    this.panelService.open(PanelDemoAkitaComponent);
  }

  ngOnDestroy() {
    this.panelService.close();
  }
}
