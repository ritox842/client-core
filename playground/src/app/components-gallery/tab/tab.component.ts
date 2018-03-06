import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dato-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input() active = false;

  constructor() { }

  ngOnInit() {
  }

}
