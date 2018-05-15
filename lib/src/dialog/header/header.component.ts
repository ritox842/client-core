import { Component, ViewEncapsulation } from '@angular/core';
import { DatoDialog } from '../../services/dialog.service';
import { DatoDialogRef } from '../dialog-ref';

@Component({
  selector: 'dato-dialog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatoDialogHeaderComponent {
  get enableClose() {
    return this.dialogRef.options.enableClose;
  }

  constructor(private dialogRef: DatoDialogRef) {}

  dismiss() {
    this.dialogRef.dismiss();
  }
}
