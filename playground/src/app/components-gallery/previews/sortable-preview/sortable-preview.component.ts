import { Component, OnInit } from "@angular/core";
import { timer } from "rxjs";
import { mapTo } from "rxjs/operators";

@Component({
  selector: "dato-sortable-preview",
  templateUrl: "./sortable-preview.component.html",
  styleUrls: ["./sortable-preview.component.scss"]
})
export class SortablePreviewComponent implements OnInit {
  items = [];
  longList = [];
  asyncList$;

  constructor() {}

  ngOnInit() {
    for (var i = 0, len = 10; i < len; i++) {
      this.items.push({
        id: i,
        title: `Item ${i + 1}`
      });
    }

    this.asyncList$ = timer(2000).pipe(mapTo(this.items));

    for (var i = 0, len = 1000; i < len; i++) {
      this.longList.push({
        id: i,
        title: `Item ${i + 1}`
      });
    }
  }

  onUpdate(event) {
    console.log(event);
  }

  remove(item) {
    this.items = this.items.filter(current => current !== item);
  }
}
