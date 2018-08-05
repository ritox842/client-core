/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoInputComponent } from './input.component';
import { DatoThemesModule } from '../themes/themes.module';
import { DatoIconModule } from '../icon/icon.module';
import { DatoDirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [CommonModule, DatoIconModule, DatoThemesModule, DatoDirectivesModule],
  declarations: [DatoInputComponent],
  exports: [DatoInputComponent]
})
export class DatoInputModule {}
