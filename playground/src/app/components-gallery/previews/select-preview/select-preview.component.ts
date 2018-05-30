import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { timer } from "rxjs/observable/timer";
import { mapTo } from "rxjs/operators";
import { debounce } from "helpful-decorators";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "dato-select-preview",
  templateUrl: "./select-preview.component.html",
  styleUrls: ["./select-preview.component.scss"]
})
export class SelectPreviewComponent implements OnInit {
  control = new FormControl();
  control2 = new FormControl();
  control3 = new FormControl(2);
  control4 = new FormControl();
  control5 = new FormControl();
  subject = new Subject();
  options$ = this.subject.asObservable();
  options = [];

  constructor() {
    for (var i = 0, len = 30; i < len; i++) {
      this.options.push({
        label: `Item ${i + 1}`,
        id: i + 1
      });
    }

    const async = [
      { id: 1, label: "abc" },
      { id: 2, label: "efg" },
      { id: 3, label: "hij" },
      { id: 4, label: "klm" },
      { id: 5, label: "nop" }
    ];
    setTimeout(() => {
      this.subject.next(async);
    }, 500);
  }

  ngOnInit() {
    this.control4.disable();
  }

  toggleDisableEnable() {
    this.control4.enabled ? this.control4.disable() : this.control4.enable();
  }

  //@debounce(500)
  onSearch(term: string) {
    this.getNewItems(term).subscribe(res => {
      this.options = res;
    });
  }

  grouped = [
    { id: 1, label: "abc", group: "A" },
    { id: 2, label: "efg", group: "A" },
    { id: 3, label: "hij", group: "A" },
    { id: 4, label: "klm", group: "B" },
    { id: 5, label: "nop", group: "C" }
  ];

  optionsFromServer = [
    { id: 1, label: "abc" },
    { id: 2, label: "efg" },
    { id: 3, label: "hij" },
    { id: 4, label: "klm" },
    { id: 5, label: "nop" }
  ];

  getNewItems(term) {
    return timer(400).pipe(
      mapTo(this.optionsFromServer.filter(item => item.label.includes(term)))
    );
  }
}
