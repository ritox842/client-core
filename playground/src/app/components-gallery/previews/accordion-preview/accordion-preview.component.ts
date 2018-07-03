import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dato-accordion-preview",
  templateUrl: "./accordion-preview.component.html",
  styleUrls: ["./accordion-preview.component.scss"]
})
export class AccordionPreviewComponent implements OnInit {
  constructor() {}
  expandAll;
  activeIds = [0];
  disable = false;
  ngOnInit() {}

  changeActive() {
    this.activeIds = [1, 2];
  }
}
