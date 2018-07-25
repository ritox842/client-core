import { Component, OnInit } from "@angular/core";
import { DatoSidenav } from "../../../../../../lib/src/sidenav/sidenav.service";
import { SidenavDemoComponent } from "./sidenav-demo.component";

@Component({
  selector: "dato-sidenav-preview",
  templateUrl: "./sidenav-preview.component.html",
  styleUrls: ["./sidenav-preview.component.scss"]
})
export class SidenavPreviewComponent implements OnInit {
  constructor(private datoSidenav: DatoSidenav) {}

  ngOnInit() {}

  open() {
    this.datoSidenav.open(SidenavDemoComponent);
  }
}
