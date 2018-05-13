import { Component, Input, OnInit } from '@angular/core';
import { DatoDialogRef } from '../dialog-ref';
import { DatoDialogActionType } from '../dialog.actions';

@Component({
  selector: 'dato-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss']
})
export class DatoDialogFooterComponent implements OnInit {
  @Input() actions = [];

  constructor(private activeModal: DatoDialogRef) {}

  ngOnInit() {
    let close = this.actions.find(a => a.type === DatoDialogActionType.SECONDARY);
    if (close) {
      close.title = 'Close';
      close.onClick = () => {
        this.activeModal.dismiss();
      };
    }
  }

  callAction(action: any) {
    action.onClick();
  }
}
