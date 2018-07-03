import { Component } from "@angular/core";

@Component({
  selector: "test-cmp",
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export class NgContentComponent {}
