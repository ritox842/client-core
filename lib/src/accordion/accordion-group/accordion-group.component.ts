/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ContentChild, Output, EventEmitter } from '@angular/core';
import { DatoAccordionContentComponent } from '../accordion-content/accordion-content.component';
import { DatoAccordionHeaderComponent } from '../accordion-header/accordion-header.component';

@Component({
  selector: 'dato-accordion-group',
  template: '<ng-content></ng-content>',
  styles: [
    `
    :host {
      display: block;
    }`
  ]
})
export class DatoAccordionGroupComponent {
  @ContentChild(DatoAccordionContentComponent) content: DatoAccordionContentComponent;
  @ContentChild(DatoAccordionHeaderComponent) header: DatoAccordionHeaderComponent;

  @Output() toggle = new EventEmitter<{ expanded: boolean }>();
}
