import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dato-api-table',
  templateUrl: './api-table.component.html',
  styleUrls: ['./api-table.component.scss']
})
export class ApiTableComponent implements OnInit {
  @Input() type: 'inputs' | 'outputs' = 'inputs';

  constructor() {
  }

  ngOnInit() {
  }

  get isOutputs() {
    return this.type === 'outputs';
  }

}
