import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dato-tooltip-preview',
  templateUrl: './tooltip-preview.component.html',
  styleUrls: ['./tooltip-preview.component.scss']
})
export class TooltipPreviewComponent implements OnInit {
  isDisabled = true;
  fromComponent = 'fromComponent';
  constructor() {}

  ngOnInit() {}

  hello() {
    alert('Akita!!!');
  }
}
