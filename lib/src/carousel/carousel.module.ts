/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoCarouselItemElement, DatoCarouselComponent } from './carousel.component';
import { DatoCarouselItemDirective } from './carousel-item.directive';
import { DatoIconModule } from '../icon/icon.module';

const publicApi = [DatoCarouselComponent, DatoCarouselItemDirective, DatoCarouselItemElement];

@NgModule({
  imports: [CommonModule, DatoIconModule],
  declarations: [publicApi],
  exports: [publicApi],
  entryComponents: [DatoCarouselComponent]
})
export class DatoCarouselModule {}
