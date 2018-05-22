import { Directive, HostBinding, HostListener, Input, Optional } from '@angular/core';
import { DatoDialogRef } from './dialog-ref';

@Directive({
  selector: '[datoDialogDismiss]'
})
export class DialogDismissDirective {
  @HostBinding('attr.type') buttonType = 'button';

  @HostListener('click')
  onClick() {
    this.dialogRef.dismiss(this.dialogResult);
  }

  /** Dialog dismiss input. */
  @Input('datoDialogDismiss') dialogResult: any;

  constructor(@Optional() private dialogRef: DatoDialogRef) {}
}
