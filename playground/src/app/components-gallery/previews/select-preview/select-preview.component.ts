import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-select-preview",
  templateUrl: "./select-preview.component.html",
  styleUrls: ["./select-preview.component.scss"]
})
export class SelectPreviewComponent implements OnInit {
  control = new FormControl();

  options = [{ label: "Netanel", id: 1 }, { label: "Moshe", id: 2 }];

  constructor() {}

  ngOnInit() {}
}
