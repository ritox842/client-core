import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { DatoDialogRef } from '../dialog-ref';
import { DatoDialog } from '../dialog.service';
import { DatoDialogOptions } from '../config/dialog.options';

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
    return this.options.enableClose;
  }

  get options(): DatoDialogOptions {
    return this.dialogRef.options || ({} as DatoDialogOptions);
  }

  constructor(private dialog: DatoDialog, private dialogRef: DatoDialogRef, public element: ElementRef) {}

  ngOnInit(): void {
    if (this.options.draggable) {
      this.draggableEnabled = true;
      this.draggableDialogElement = this.dialog.getClosestDialogElement(this.element.nativeElement);
    }
  }
}
