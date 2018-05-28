import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-select-preview",
  templateUrl: "./select-preview.component.html",
  styleUrls: ["./select-preview.component.scss"]
})
export class SelectPreviewComponent implements OnInit {
  control = new FormControl();

  constructor() {}

  ngOnInit() {}
}
