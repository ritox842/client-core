import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DatoDialogOptions, dialogSizePreset } from '../config/dialog.options';
import { Observable } from 'rxjs';
import { DatoDialogRef } from '../dialog-ref';
import { setDimensions, setMinDimensions } from '../../internal/custom-dimensions';

@Component({
  selector: 'dato-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    tabindex: '-1',
    role: 'dialog'
  }
})
export class DatoDialogComponent implements OnInit {
  destroyed$: Observable<boolean>;
  @Input() options: DatoDialogOptions;

  constructor(private element: ElementRef, private dialogRef: DatoDialogRef) {}

  ngOnInit(): void {
    const projectionElement = this.element.nativeElement.querySelector('.dato-dialog-projection');

    // set custom size
    let { width, height } = this.dialogRef.options;
    const preset = dialogSizePreset[this.dialogRef.options.size];
    width = width || preset[0];
    height = height || preset[1];

    setDimensions(width, null, projectionElement);
    setMinDimensions(null, height, projectionElement);
  }
}
