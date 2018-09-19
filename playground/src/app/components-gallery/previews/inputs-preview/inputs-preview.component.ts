import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'dato-inputs-preview',
  templateUrl: './inputs-preview.component.html',
  styleUrls: ['./inputs-preview.component.scss']
})
export class InputsPreviewComponent implements OnInit, OnDestroy {
  inputControl = new FormControl('initial value');

  checkboxControl = new FormControl(true);
  radioControl = new FormControl('female');
  radioControl2 = new FormControl();
  radioDisableControl = new FormControl(true);
  checkboxCheckedControl = new FormControl(true);
  checkboxDisableControl = new FormControl(false);
  radioDynamic = new FormControl();
  // custom checkbox value
  checkboxCustomValueControl = new FormControl('yep');
  togglerControl = new FormControl(false);
  togglerControl2 = new FormControl(true);
  togglerControl3 = new FormControl({ disabled: true, value: false });

  radios = [{ title: 'With ngFor one', value: 'one' }, { title: 'With ngFor two', value: 'two' }];
  constructor() {}

  ngOnInit() {
    this.radioDisableControl.disable();
    // enable/disable the checkbox
    this.checkboxDisableControl.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      value ? this.checkboxControl.disable() : this.checkboxControl.enable();
    });

    // checked/unchecked the checkbox
    this.checkboxCheckedControl.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.checkboxControl.patchValue(value);
    });
  }

  ngOnDestroy(): void {}
}
