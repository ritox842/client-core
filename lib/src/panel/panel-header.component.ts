import { Component } from '@angular/core';
import { DatoPanel } from './panel.service';

@Component({
  selector: 'dato-panel-header',
  template: `
    <header class="d-flex panel-header">
      <div>
        <ng-content></ng-content>
      </div>

      <dato-icon datoIcon="close" (click)="close()"></dato-icon>
    </header>
  `
})
export class DatoPanelHeaderComponent {
  constructor(private panelService: DatoPanel) {}

  close() {
    this.panelService.close();
  }
}
