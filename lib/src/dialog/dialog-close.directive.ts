import { Directive, Input, Optional } from '@angular/core';
import { DatoDialogRef } from './dialog-ref';

@Directive({
  selector: '[datoDialogClose]',
  host: {
    '(click)': 'close()',
    type: 'button' // Prevents accidental form submits.
  }
})
export class DialogCloseDirective {
  /** Dialog close input. */
  @Input('datoDialogClose') dialogResult: any;

  constructor(@Optional() private dialogRef: DatoDialogRef) {}

  close() {
    debugger;
    this.dialogRef.close(this.dialogResult);
  }
}
