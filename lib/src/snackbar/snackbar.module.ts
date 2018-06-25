/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSnackbarComponent } from './snackbar.component';
import { DatoIconModule } from '../icon/icon.module';
import { DatoThemesModule } from '../themes/themes.module';

@NgModule({
  imports: [CommonModule, DatoIconModule, DatoThemesModule],
  declarations: [DatoSnackbarComponent],
  exports: [DatoSnackbarComponent],
  entryComponents: [DatoSnackbarComponent]
})
export class DatoSnackbarModule {}
