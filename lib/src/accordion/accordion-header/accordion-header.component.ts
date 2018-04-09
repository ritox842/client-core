/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, forwardRef, HostBinding, Inject, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { AccordionContentComponent } from '../accordion-content/accordion-content.component';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'dato-accordion-header',
  template: `
    <ng-content></ng-content>`,
  styles: [
    `:host {
    display: block;
  }`
  ]
})
export class AccordionHeaderComponent implements AfterContentInit, OnDestroy {
  private _isExpanded = false;
  click$ = fromEvent(this.element, 'click');

  @HostBinding('class.expanded')
  set isExpanded(value: boolean) {
    this._isExpanded = value;
  }

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(forwardRef(() => AccordionContentComponent))
    public parent: AccordionContentComponent,
    public host: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    // required for @TakeUntilDestroy()
  }

  get element() {
    return this.host.nativeElement;
  }

  ngAfterContentInit() {
    if (this.parent) {
      this.parent.expand$.pipe(untilDestroyed(this)).subscribe(isExpanded => {
        if (!isExpanded) {
          this.isExpanded = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
