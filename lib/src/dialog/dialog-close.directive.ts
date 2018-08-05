import { Directive, HostListener, Input, Optional } from '@angular/core';
import { DatoDialogRef } from './dialog-ref';

@Directive({
  selector: '[datoDialogClose]'
})
export class DatoDialogCloseDirective {
  @HostListener('click')
  onClick() {
    this.dialogRef.close(this.dialogResult);
  }

  /** Dialog close input. */
  @Input('datoDialogClose') dialogResult: any;

  constructor(@Optional() private dialogRef: DatoDialogRef) {}
}
