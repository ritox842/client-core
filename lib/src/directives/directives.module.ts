/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DatoOriginDirective } from './origin.directive';
import { DatoDraggableDirective } from './drag.directive';

const directives = [DatoOriginDirective, DatoDraggableDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DatoDirectives {}
