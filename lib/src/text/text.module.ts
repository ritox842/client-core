/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoTextComponent } from './text.component';
import { DatoFontDirective } from './font.directive';

export const declarations = [DatoTextComponent, DatoFontDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...declarations],
  exports: [...declarations]
})
export class DatoTextModule {}
