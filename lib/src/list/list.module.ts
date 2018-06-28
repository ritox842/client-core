/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoListComponent } from './list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoInputModule } from '../input/input.module';
import { DatoSelectModule } from '../select/select.module';
import { DatoButtonModule } from '../button/button.module';

const publicApi = [DatoListComponent];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DatoButtonModule, DatoInputModule, DatoSelectModule],
  declarations: [publicApi],
  exports: [publicApi],
  entryComponents: [publicApi]
})
export class DatoListModule {}
