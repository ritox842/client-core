/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorDirective } from './color.directive';
import { PaletteDirective } from './palette.directive';

export const directives = [ColorDirective, PaletteDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...directives],
  exports: [...directives]
})
export class DatoThemesModule {}
