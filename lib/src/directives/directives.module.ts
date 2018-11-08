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
import { DatoAutoFocusDirective } from './auto-focus.directive';
import { DatoTooltipDirective } from './tooltip.directive';
import { DatoSubscribeDirective } from './subscribe.directive';
import { DatoDisableControlDirective } from './disable-control.directive';
import { DatoClipboardDirective } from './clipboard.directive';
import { DatoSearchableDirective } from './searchable.directive';
import { DatoSearchableContainerComponent } from './searchable-container.component';

const directives = [DatoSearchableContainerComponent, DatoOriginDirective, DatoSearchableDirective, DatoDraggableDirective, DatoAutoFocusDirective, DatoTooltipDirective, DatoSubscribeDirective, DatoClipboardDirective, DatoDisableControlDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DatoDirectivesModule {}
