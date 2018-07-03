/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'dato-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [@slideInOut] *ngIf="_expanded">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
    :host {
      overflow: hidden;
      display: block;
    }

  `
  ],
  animations: [trigger('slideInOut', [transition(':enter', [style({ height: '0px' }), animate('200ms', style({ height: '*' }))]), transition(':leave', [style({ height: '*' }), animate('200ms', style({ height: '0px' }))])])]
})
export class DatoAccordionContentComponent {
  _expanded: boolean = false;

  @Input()
  set expanded(value) {
    this._expanded = value;
    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
