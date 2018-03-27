/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionHeaderComponent } from './accordion-header/accordion-header.component';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionContentComponent } from './accordion-content/accordion-content.component';
import { AccordionGroupComponent } from './accordion-group/accordion-group.component';

const publicApi = [
  AccordionComponent,
  AccordionContentComponent,
  AccordionGroupComponent,
  AccordionHeaderComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: [publicApi],
  exports: [publicApi]
})
export class DatoAccordionModule {}
