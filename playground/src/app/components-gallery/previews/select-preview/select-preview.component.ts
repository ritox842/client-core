import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { timer } from "rxjs/observable/timer";
import { mapTo } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { DatoSnackbar } from "../../../../../../lib";

@Component({
  selector: "dato-select-preview",
  templateUrl: "./select-preview.component.html",
  styleUrls: ["./select-preview.component.scss"]
})
export class SelectPreviewComponent implements OnInit {
  private subject = new Subject();

  simpleControl = new FormControl({ id: 1, label: "Item 1" });
  simpleControlSearch = new FormControl();
  asyncControl = new FormControl();
  controlDisabled = new FormControl();
  activeTplControl = new FormControl();
  groupControl = new FormControl();
  serverSideControl = new FormControl();
  multiControl = new FormControl();
  withActionsControl = new FormControl();
  groupControlMulti = new FormControl();
  customFooterControl = new FormControl();

  options$ = this.subject.asObservable();
  options = [];
  optionsFromServer;

  constructor(private snackbar: DatoSnackbar) {
    for (var i = 0, len = 15; i < len; i++) {
      this.options.push({
        label: `Item ${i + 1}`,
        id: i + 1
      });
    }

    setTimeout(() => {
      this.subject.next(this.options);
    }, 500);

    this.optionsFromServer = this.options.slice();
  }

  dynamic;

  ngOnInit() {
    this.controlDisabled.disable();

    this.dynamic = [
      {
        options: this.options.slice()
      },
      {
        options: this.options.slice()
      }
    ];
  }

  toggleDisableEnable() {
    this.controlDisabled.enabled
      ? this.controlDisabled.disable()
      : this.controlDisabled.enable();
  }

  onSearch(term: string) {
    this.getNewItems(term).subscribe(res => {
      this.optionsFromServer = res;
      this.isLoading = false;
    });
  }

  grouped = [
    {
      label: "A",
      children: [
        { id: 1, label: "abc" },
        { id: 2, label: "efg" },
        { id: 3, label: "hij" }
      ]
    },
    {
      label: "B",
      children: [{ id: 4, label: "klm" }]
    },
    {
      label: "C",
      children: [{ id: 5, label: "nop" }]
    }
  ];

  _optionsFromServer = [
    { id: 1, label: "abc" },
    { id: 2, label: "efg" },
    { id: 3, label: "hij" },
    { id: 4, label: "klm" },
    { id: 5, label: "nop" }
  ];

  isLoading = false;

  getNewItems(term) {
    this.isLoading = true;

    return timer(500).pipe(
      mapTo(this._optionsFromServer.filter(item => item.label.includes(term)))
    );
  }

  onSave() {
    this.snackbar.success("Success!!!");
  }
}
