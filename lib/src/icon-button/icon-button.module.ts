/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoIconModule } from '../icon/icon.module';
import { DatoButtonModule } from '../button/button.module';
import { DatoIconButtonComponent } from './icon-button.component';
import { DatoThemesModule } from '../themes/themes.module';

@NgModule({
  imports: [CommonModule, DatoButtonModule, DatoIconModule, DatoThemesModule],
  declarations: [DatoIconButtonComponent],
  exports: [DatoIconButtonComponent]
})
export class DatoIconButtonModule {}
