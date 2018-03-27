/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DatoOriginDirective } from './origin.directive';

const directives = [DatoOriginDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DatoDirectives {}
