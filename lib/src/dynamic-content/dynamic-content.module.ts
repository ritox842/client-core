/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoDynamicContentComponent } from './dynamic-content.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DatoDynamicContentComponent],
  exports: [DatoDynamicContentComponent]
})
export class DatoDynamicContentModule {}
