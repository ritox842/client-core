/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'dato-accordion-content',
  template: `
    <div [@slideInOut] *ngIf="expanded">
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
  @Input() expanded = false;
}
