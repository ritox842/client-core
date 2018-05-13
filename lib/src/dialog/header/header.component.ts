import { Component } from '@angular/core';
import { DatoDialog } from '../../services/dialog.service';

@Component({
  selector: 'dato-dialog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DatoDialogHeaderComponent {
  constructor(private modal: DatoDialog) {}

  dismiss() {
    this.modal.dismiss();
  }
}
