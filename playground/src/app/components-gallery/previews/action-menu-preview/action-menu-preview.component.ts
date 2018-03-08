import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dato-action-menu-preview',
  templateUrl: './action-menu-preview.component.html',
  styleUrls: ['./action-menu-preview.component.scss']
})
export class ActionMenuPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  click() {
    console.log('called');
  }

}
