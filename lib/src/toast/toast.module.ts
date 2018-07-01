/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoToastComponent } from './toast.component';
import { DatoIconModule } from '../icon/icon.module';
import { DatoThemesModule } from '../themes/themes.module';
import { DatoDynamicContentModule } from '../dynamic-content/dynamic-content.module';

@NgModule({
  imports: [CommonModule, DatoIconModule, DatoThemesModule, DatoDynamicContentModule],
  declarations: [DatoToastComponent],
  exports: [DatoToastComponent],
  entryComponents: [DatoToastComponent]
})
export class DatoToastModule {}
