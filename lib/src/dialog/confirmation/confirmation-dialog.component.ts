import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DatoDialogRef } from '../dialog-ref';
import { ConfirmationType, DatoConfirmationOptions } from '../config/dialog-confirmation.options';

@Component({
  selector: 'dato-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoConfirmationDialogComponent {
  options: DatoConfirmationOptions;

  @HostBinding('class.disruptive') isDisruptive = false;

  constructor(private dialogRef: DatoDialogRef) {
    this.options = dialogRef.options as DatoConfirmationOptions;

    this.isDisruptive = this.options.confirmationType === ConfirmationType.DISRUPTIVE_WARNING;
  }
}
