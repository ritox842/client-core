/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import {
  AfterContentInit,
  Component,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  SkipSelf
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs/Subject';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'dato-accordion-content',
  template: `
    <div [@slideInOut] *ngIf="isExpanded">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `:host {
    overflow: hidden;
    display: block;
  }`
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ height: '0px' }), animate('200ms', style({ height: '*' }))]),
      transition(':leave', [style({ height: '*' }), animate('200ms', style({ height: '0px' }))])
    ])
  ]
})
export class AccordionContentComponent implements AfterContentInit, OnDestroy {
  private _isExpanded;
  expand$ = new Subject();

  @Input()
  set isExpanded(val: boolean) {
    this._isExpanded = val;
    this.expand$.next(val);
  }

  get isExpanded() {
    return this._isExpanded;
  }

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(forwardRef(() => AccordionContentComponent))
    public parent: AccordionContentComponent
  ) {}

  ngAfterContentInit() {
    if (this.parent) {
      this.parent.expand$.pipe(untilDestroyed(this)).subscribe(isExpanded => {
        if (!isExpanded) {
          this.isExpanded = false;
        }
      });
    }
  }

  ngOnDestroy() {
    // required for @TakeUntilDestroy()
  }
}
