import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DatoDialogOptions, dialogSizePreset } from '../config/dialog.options';
import { takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { DatoDialogRef } from '../dialog-ref';
import { setDimensions, setMinDimensions } from '../../internal/custom-dimensions';

@TakeUntilDestroy()
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
export class DatoDialogComponent implements OnInit, OnDestroy {
  destroyed$: Observable<boolean>;
  @Input() options: DatoDialogOptions;

  constructor(private element: ElementRef, private dialogRef: DatoDialogRef) {}

  ngOnInit(): void {
    const projectionElement = this.element.nativeElement.querySelector('.dato-dialog-projection');

    // prevent from click events from propagate to the backdrop
    fromEvent(projectionElement, 'click')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((e: Event) => e.stopPropagation());

    // set custom size
    let { width, height } = this.dialogRef.options;
    const preset = dialogSizePreset[this.dialogRef.options.size];
    width = width || preset[0];
    height = height || preset[1];

    setDimensions(width, null, projectionElement);
    setMinDimensions(null, height, projectionElement);
  }

  ngOnDestroy(): void {}
}