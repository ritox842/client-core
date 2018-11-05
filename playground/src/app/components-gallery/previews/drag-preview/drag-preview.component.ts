import { ChangeDetectorRef, Component } from '@angular/core';
import { DraggedEvent } from '../../../../../../lib';

@Component({
  selector: 'dato-drag-preview',
  templateUrl: './drag-preview.component.html',
  styleUrls: ['./drag-preview.component.scss']
})
export class DragPreviewComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  enabled = true;
  delta: DraggedEvent = { x: 0, y: 0 };

  toggleEnabled() {
    this.enabled = !this.enabled;
  }

  dragged(delta: DraggedEvent) {
    this.delta = delta;
    this.cdr.detectChanges();
  }
}
