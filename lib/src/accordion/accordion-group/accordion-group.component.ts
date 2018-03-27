/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ContentChild, EventEmitter, Output } from '@angular/core';
import { AccordionContentComponent } from '../accordion-content/accordion-content.component';
import { AccordionHeaderComponent } from '../accordion-header/accordion-header.component';

@Component({
  selector: 'dato-accordion-group',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `:host {
    display: block;
  }`
  ]
})
export class AccordionGroupComponent {
  @ContentChild(AccordionContentComponent) content: AccordionContentComponent;
  @ContentChild(AccordionHeaderComponent) header: AccordionHeaderComponent;

  @Output() collapse = new EventEmitter<boolean>();
  @Output() expand = new EventEmitter<boolean>();
}
