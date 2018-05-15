/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoTogglerComponent } from './toggler.component';
import { DatoTextModule } from '../text/text.module';

const publicApi = [DatoTogglerComponent];

@NgModule({
  imports: [CommonModule, DatoTextModule],
  declarations: [publicApi],
  exports: [publicApi],
  entryComponents: [publicApi]
})
export class DatoTogglerModule {}
