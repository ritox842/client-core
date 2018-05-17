import { Component } from '@angular/core';
import { DatoDialogRef } from '../dialog-ref';
import { DatoConfirmationOptions } from '../config/dialog-confirmation.options';

@Component({
  selector: 'dato-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class DatoConfirmationDialogComponent {
  options: DatoConfirmationOptions;

  constructor(private dialogRef: DatoDialogRef) {
    this.options = dialogRef.options as DatoConfirmationOptions;
  }
}
