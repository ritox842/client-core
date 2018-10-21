/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoAceComponent } from './ace.component';
import { AceDraggableDirective } from './ace-draggable.directive';

const publicApi = [DatoAceComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [publicApi, AceDraggableDirective],
  exports: [publicApi, AceDraggableDirective],
  entryComponents: [publicApi]
})
export class DatoAceModule {}
