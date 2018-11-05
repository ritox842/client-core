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

const directives = [DatoOriginDirective, DatoDraggableDirective, DatoAutoFocusDirective, DatoTooltipDirective, DatoSubscribeDirective, DatoClipboardDirective, DatoDisableControlDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DatoDirectivesModule {}
