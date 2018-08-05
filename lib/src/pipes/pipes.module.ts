/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DatoHighlightPipe } from './highlight-text.pipe';

const pipes = [DatoHighlightPipe];

@NgModule({
  declarations: pipes,
  exports: pipes
})
export class DatoPipesModule {}
