import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { DatoDialogRef } from '../dialog-ref';
import { DatoDialog } from '../dialog.service';

@Component({
  selector: 'dato-dialog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatoDialogHeaderComponent implements OnInit {
  draggableDialogElement: HTMLElement;
  draggableEnabled = false;

  get enableClose() {
    return this.dialogRef.options.enableClose;
  }

  constructor(private dialog: DatoDialog, private dialogRef: DatoDialogRef, public element: ElementRef) {}

  ngOnInit(): void {
    if (this.dialogRef.options.draggable) {
      this.draggableEnabled = true;
      this.draggableDialogElement = this.dialog.getClosestDialogElement(this.element.nativeElement);
    }
  }
}
