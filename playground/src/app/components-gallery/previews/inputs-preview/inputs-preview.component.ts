import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TakeUntilDestroy, untilDestroyed } from "ngx-take-until-destroy";

@TakeUntilDestroy()
@Component({
  selector: "dato-inputs-preview",
  templateUrl: "./inputs-preview.component.html",
  styleUrls: ["./inputs-preview.component.scss"]
})
export class InputsPreviewComponent implements OnInit, OnDestroy {
  inputControl = new FormControl("initial value");

  checkboxControl = new FormControl(true);
  checkboxCheckedControl = new FormControl(true);
  checkboxDisableControl = new FormControl(false);

  // custom checkbox value
  checkboxCustomValueControl = new FormControl("yep");

  constructor() {}

  ngOnInit() {
    // enable/disable the checkbox
    this.checkboxDisableControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        value ? this.checkboxControl.disable() : this.checkboxControl.enable();
      });

    // checked/unchecked the checkbox
    this.checkboxCheckedControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.checkboxControl.patchValue(value);
      });
  }

  ngOnDestroy(): void {}
}
