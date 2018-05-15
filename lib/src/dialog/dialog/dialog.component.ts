import { Component, ContentChild, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DatoDialogOptions } from '../dialog.options';
import { takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

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

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    fromEvent(this.element.nativeElement.querySelector('.dato-dialog-projection'), 'click')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((e: Event) => e.stopPropagation());
  }

  ngOnDestroy(): void {}
}
