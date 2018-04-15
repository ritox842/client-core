/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoAccordionComponent } from './accordion/accordion.component';
/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { DatoAccordionContentComponent } from './accordion-content/accordion-content.component';
import { DatoAccordionGroupComponent } from './accordion-group/accordion-group.component';
import { DatoAccordionHeaderComponent } from './accordion-header/accordion-header.component';

const publicApi = [DatoAccordionComponent, DatoAccordionContentComponent, DatoAccordionGroupComponent, DatoAccordionHeaderComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [publicApi],
  exports: [publicApi]
})
export class DatoAccordionModule {}
