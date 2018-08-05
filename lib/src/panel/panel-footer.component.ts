import { Component } from '@angular/core';

@Component({
  selector: 'dato-panel-footer',
  template: `
    <footer class="panel-footer d-flex align-end-center">
      <ng-content></ng-content>
    </footer>
  `
})
export class DatoPanelFooterComponent {}
