import { Component } from '@angular/core';

@Component({
  selector: 'dato-panel-content',
  template: `
    <div class="dato-panel-content">
      <ng-content></ng-content>
    </div>
  `
})
export class DatoPanelContentComponent {}
