/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSearchableDirective } from './searchable.directive';
import { DatoSearchableHighlightDirective } from './searchable-highlight.directive';
import { DatoSearchableContainerComponent } from './searchable-container.component';

const publicApi = [DatoSearchableDirective, DatoSearchableHighlightDirective, DatoSearchableContainerComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [publicApi],
  exports: [publicApi]
})
export class DatoSearchableModule {}
