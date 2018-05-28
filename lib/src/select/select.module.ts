/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSelectComponent } from './select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { DatoOptioneDirective } from './select-option.directive';
import { DatoIconModule } from '../icon/icon.module';
import { DatoInputModule } from '../input/input.module';
import { DatoTriggerSingle } from './trigger-single/trigger-single.component';
import { DatoSelectActiveDirective } from './select-active.directive';

const publicApi = [DatoSelectComponent, DatoTriggerSingle];
const directives = [DatoOptioneDirective, DatoSelectActiveDirective];

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, DatoInputModule, DatoIconModule],
  declarations: [publicApi, directives],
  exports: [publicApi, directives],
  entryComponents: [publicApi]
})
export class DatoSelectModule {}
