/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { DatoThemesModule } from '../themes/themes.module';
import { DatoIconModule } from '../icon/icon.module';

@NgModule({
  imports: [CommonModule, DatoIconModule, DatoThemesModule],
  declarations: [InputComponent],
  exports: [InputComponent]
})
export class DatoInputModule {}
