import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-inputs-preview",
  templateUrl: "./inputs-preview.component.html",
  styleUrls: ["./inputs-preview.component.scss"]
})
export class InputsPreviewComponent implements OnInit {
  control = new FormControl("initial value");

  checked = false;
  disabled = false;

  constructor() {}

  ngOnInit() {}
}
