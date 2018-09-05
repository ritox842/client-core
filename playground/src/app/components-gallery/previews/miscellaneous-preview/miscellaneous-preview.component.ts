import { Component, OnInit } from "@angular/core";
import { interval, of } from "rxjs";

@Component({
  selector: "dato-miscellaneous-preview",
  templateUrl: "./miscellaneous-preview.component.html",
  styleUrls: ["./miscellaneous-preview.component.scss"]
})
export class MiscellaneousPreviewComponent implements OnInit {
  interval$ = interval(1000);
  intervals = {
    intOne: interval(3000),
    intTwo: interval(3000)
  };

  test$ = of({ name: "Akita!!" });

  constructor() {}

  ngOnInit() {}
}
