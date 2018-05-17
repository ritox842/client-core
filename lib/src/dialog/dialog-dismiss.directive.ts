import { Directive, Input, Optional } from '@angular/core';
import { DatoDialogRef } from './dialog-ref';

@Directive({
  selector: '[datoDialogDismiss]',
  host: {
    '(click)': 'close()',
    type: 'button' // Prevents accidental form submits.
  }
})
export class DialogDismissDirective {
  /** Dialog dismiss input. */
  @Input('datoDialogDismiss') dialogResult: any;

  constructor(@Optional() private dialogRef: DatoDialogRef) {}

  close() {
    this.dialogRef.dismiss(this.dialogResult);
  }
}
