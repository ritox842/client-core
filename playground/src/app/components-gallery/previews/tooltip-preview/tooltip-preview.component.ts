import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-tooltip-preview',
  templateUrl: './tooltip-preview.component.html',
  styleUrls: ['./tooltip-preview.component.scss']
})
export class TooltipPreviewComponent implements OnInit {
  isDisabled = true;
  fromComponent = 'fromComponent';
  longText = 'Long Long All Text';
  editableTextControl = new FormControl('Editable text');

  constructor() {}

  ngOnInit() {}

  hello() {
    alert('Akita!!!');
  }
}
