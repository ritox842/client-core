import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dato-action-menu-item',
  template: `
    <div class="dato-dd-item d-flex-row">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoActionMenuItemComponent {}
