import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-layout-preview",
  templateUrl: "./layout-preview.component.html",
  styleUrls: ["./layout-preview.component.scss"]
})
export class LayoutPreviewComponent implements OnInit {
  header = new FormControl("Header Text");

  constructor() {}

  ngOnInit() {}
}
