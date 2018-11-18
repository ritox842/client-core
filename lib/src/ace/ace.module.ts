/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DatoAceDraggableDirective } from './ace-draggable.directive';
import { DatoAceDirective } from './ace.directive';

const publicApi = [DatoAceDraggableDirective, DatoAceDirective];

@NgModule({
  declarations: [publicApi],
  exports: [publicApi]
})
export class DatoAceModule {}
