import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "list-item",
  template: `
    <div>
      <span datoSortableHandle>::</span>
      <div style="display: flex; justify-content: space-between; flex: 1;">
        <span>{{item.title}}</span>
        <button type="button" (click)="remove.emit(item)">x</button>
      </div>
    </div>
  `,
  styles: [
    `
    [datoSortableHandle] {
      margin: 0 10px;
      font-size: 20px;
    }

    div {
      display: flex;
      height: 100%;
      align-items: center;
    }

    button {
      margin-right: 10px;
    }

    :host {
      display: block;
      width: 230px;
      height: 30px;
      background-color: lightgoldenrodyellow;
      margin-bottom: 5px;
      color: #484848;
      font-size: 12px;
    }
  `
  ]
})
export class ListItemComponent implements OnInit {
  @Input() item;
  @Output() remove = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
